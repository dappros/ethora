import {IQuestion} from "./IQuestions";
import Web3 from "web3";

export const questions: IQuestion[] = [
    {
        name: 'artId',
        message: (user) => {
            return {
                messages: [
                    `Hi ${user.firstName} ${user.lastName}, I’m the Create Bot. I help people create digital collectibles (NFT’s). You will need a digital asset (image, video or sound) and 3 Coins to create your own collection.`,
                    'Just so that you know, I will use “NFmT Standard” template for your collection set up.',
                    'This means in your collection you will have:',
                    '1) 25 x Paper NFTs: free,\n2) 50 x Copper: 100 Coin ($0.1) each,\n3) 100 x Steel: 1,000 ($1) each,\n4) 10 x Silver: 50,000 ($50) each,\n5) 3 x Gold: 150,000 ($150) each,\n6) 1 x Diamond: 1,000,000 ($1,000) each, with a total minted value of 189 NFTs and $2,055.',
                    'Any User will be able to purchase NFTs directly from this Collection.',
                    'Tip: you can type ‘exit’ or ’stop’ any time before we finish the mint in case if you change your mind.',
                    'To proceed, please send your art. JPG and PNG images are supported. (Hint: use paperclip icon bottom left.)',
                ]
            }
        },
        validateAnswer: (session, data, index) => {
            return {
                status: ['image/jpeg', 'image/png'].some((el) => el === data.messageData.mimetype),
                messages: questions[index].message(data.user, session.state.answers).messages.slice(-1)
            }
        },
        handler: (session, data, index) => {
            const {attachmentId} = data.messageData;
            const {name} = questions[index];
            const answers = {...session.state.answers, [name]: attachmentId};
            session.setState({answers});
        }
    },
    {
        name: 'collectionName',
        message: (user) => {
            return {
                messages: [
                    `${user.firstName} ${user.lastName}, please enter a name for your Items collection.`,
                    'It should contain from 3 to 20 characters'
                ]
            }
        },
        validateAnswer: (session, data, index: number) => {
            return {
                status: data.message.length >= 3 && data.message.length <= 20,
                messages: questions[index].message(data.user, session.state.answers).messages
            }
        },
        handler: (session, data, index) => {
            const {message} = data;
            const {name} = questions[index];
            const answers = {...session.state.answers, [name]: message};
            session.setState({answers});
        }
    },
    {
        name: 'collectionDescription',
        message: (user, answers) => {
            return {
                messages: [
                    `${user.firstName} ${user.lastName}. Noted, the name will be "${answers.collectionName}"`,
                    'Please enter a description for your Items collection. It should contain from 10 to 512 characters'
                ]
            }
        },
        validateAnswer: (session, data, index) => {
            return {
                status: data.message.length >= 10 && data.message.length < 513,
                messages: questions[index].message(data.user, session.state.answers).messages.slice(-1)
            }
        },
        handler: (session, data, index) => {
            const {message} = data;
            const {name} = questions[index];
            const answers = {...session.state.answers, [name]: message};
            session.setState({answers});
        }
    },
    {
        name: 'benPercent',
        message: () => {
            return {
                messages: [
                    `Sales proceeds will go to you by default. In case you wanted to add another beneficiary, please specify how much of the proceeds they should receive:`,
                ],
                keyboard: [
                    {name: 'Share 100%', value: 'Share 100%', notDisplayedValue: 100},
                    {name: 'Share 90%', value: 'Share 90%', notDisplayedValue: 90},
                    {name: 'Share 50%', value: 'Share 50%', notDisplayedValue: 50},
                    {name: 'Share 10%', value: 'Share 10%', notDisplayedValue: 10},
                    {
                        name: 'Not at the moment - skip this step',
                        value: 'Not at the moment - skip this step',
                        notDisplayedValue: 0
                    },
                ]
            }
        },
        validateAnswer: (session, data, index) => {
            const {messages, keyboard} = questions[index].message(data.user, session.state.answers);
            let status = keyboard.some(({notDisplayedValue}) => notDisplayedValue === Number(data.messageData.notDisplayedValue))

            if (!data.messageData.notDisplayedValue) {
                status = false;
            }
            return {
                status,
                messages,
                keyboard
            }

        },
        handler: (session, data, index) => {
            const {notDisplayedValue} = data.messageData;
            const {name} = questions[index];
            const answers = {...session.state.answers, [name]: Number(notDisplayedValue)};
            session.setState({answers});
        }
    },
    {
        name: 'benAddress',
        message: (user, answers) => {
            if (answers.benPercent === 0) {
                return null
            }
            return {
                messages: [
                    `Please enter an address for your beneficiary that will receive ${answers.benPercent}% of sales proceeds from this collection.`,
                ],
            }
        },
        validateAnswer: (session, data, index) => {
            const {message} = data;
            const {messages} = questions[index].message(data.user, session.state.answers);
            return {
                status: Web3.utils.isAddress(message), messages
            }

        },
        handler: (session, data, index) => {
            const {message} = data;
            const {name} = questions[index];
            const answers = {...session.state.answers, [name]: message};
            session.setState({answers});
        }
    },
    {
        name: 'getCoins',
        message: () => {
            return {
                messages: [
                    `Now, simply send me 3 Coins (hint: long tap on my message) to mint your NFT collection.`,
                ],
            }
        },
        validateAnswer: (session, data) => {
            const {transaction} = data.messageData;
            const defaultCoins = 3 - session.state.coinsLeft;
            const coinDiff = defaultCoins - transaction.value;
            session.setState({coinsLeft: coinDiff});

            if (!transaction || transaction.value < defaultCoins) {
                return {
                    status: false,
                    messages: [`Now, simply send me ${coinDiff} Coins (hint: long tap on my message) to mint your NFT collection.`]
                };
            }

            return {status: true};
        },
        handler: (session, data, index) => {
            const {value} = data.messageData.transaction;
            const {name} = questions[index];
            const answers = {...session.state.answers, [name]: value};
            session.setState({answers});
        }
    },
];

export async function onEnd(ctx: any) {
    await ctx.session.sendTextMessage('Righty-ho, I’m minting 🛠️ your collection smart contract 📜 on chain 🔗 as we speak, you can leave this with me now.');
    try {
        const {collectionName, collectionDescription, artId} = ctx.session.state.answers;
        const type = 'light';
        const name = collectionName;
        const description = collectionDescription;
        const owner = ctx.message.data.user.walletAddress;
        const maxSupplies = [25, 50, 100, 10, 3, 1];

        let beneficiaries: string[] = []
        let splitPercents: number[] = []

        switch (ctx.session.state.answers.benPercent) {
            case 100:
                beneficiaries.push(ctx.session.state.answers.benAddress)
                splitPercents.push(1000)
                break
            case 90:
                beneficiaries = [ctx.message.data.user.walletAddress, ctx.session.state.answers.benAddress]
                splitPercents = [100, 900]
                break
            case 50:
                beneficiaries = [ctx.message.data.user.walletAddress, ctx.session.state.answers.benAddress]
                splitPercents = [500, 500]
                break
            case 10:
                beneficiaries = [ctx.message.data.user.walletAddress, ctx.session.state.answers.benAddress]
                splitPercents = [900, 100]
                break
            case 0:
                beneficiaries = [ctx.message.data.user.walletAddress]
                splitPercents = [1000]
                break
        }
        const costs = [
            '0',
            Web3.utils.toWei('100'),
            Web3.utils.toWei('1000'),
            Web3.utils.toWei('50000'),
            Web3.utils.toWei('150000'),
            Web3.utils.toWei('1000000'),
        ]
        const attachmentId = artId
        const deployData = {
            type,
            name,
            description,
            owner,
            beneficiaries,
            splitPercents,
            costs,
            attachmentId,
            maxSupplies,
        }

        const deployResp = await ctx.api.deployNfmt(deployData);

        ctx.stepper.removeNextUserStep();
        ctx.session.setState({
            answers: {},
            coinsLeft: 0,
        });

        await ctx.session.sendTextMessage(
            [
                'Awesome and congrats 😎🍸! Your NFT collection has been minted.',
                'It should be accessible in your profile under “Collections” tab now. Anybody can purchase NFTs first come - first served, starting now!',
                'Good bye 👋 and looking forward to be working with you again!',
                `${ctx.session.state.answers.collectionName}`,
            ]
        );

        return await ctx.session.sendMediaMessage({
            isVisible: true,
            mimetype: deployResp?.token?.nftMimetype,
            location: deployResp?.token?.nftFileUrl,
            locationPreview: deployResp.token.nftPreview,
            contractAddress: deployResp.token.contractAddress,
            nftId: deployResp.token._id,
            attachmentId: attachmentId
        })
    } catch (error) {
        console.log(error)
    }
}