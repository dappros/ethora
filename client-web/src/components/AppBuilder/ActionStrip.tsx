
//interfaces
interface TActionStrip {
    currentScreenIndex: number
    screenSet: {
        screenName: string;
        index: number;
    }[]
    handlePrevClick: () => void
    handleNextClick: () => void
    handleSubmit: () => void
}


export function ActionStrip(props: TActionStrip) {

    const {
        currentScreenIndex,
        screenSet,
        handleNextClick,
        handlePrevClick,
        handleSubmit
    } = props;

    return (
        <div className={"actionStrip"}>
            <div className={"leftActionStrip"}>
                <div className={"actionButtonGroup"}>
                    <button
                        className={"prevButton"}
                        onClick={handlePrevClick}
                        disabled={currentScreenIndex === 0}
                    >
                        Previous
                    </button>

                    <button
                        className={"nextButton"}
                        onClick={handleNextClick}
                        disabled={currentScreenIndex === screenSet.length - 1}
                    >
                        Next
                    </button>
                </div>
            </div>
            {/* <div className={"rightActionStrip"}>
                <button className="submitButton" onClick={() => handleSubmit()}>
                    <p>Submit and Build</p>
                </button>
            </div> */}
            <style>
                {
                    `
                    .actionStrip {
                        display: flex;
                        flex-basis: 10%;
                        width: 100%;
                        background: linear-gradient(145deg, #2a7dfa, #2369d3);
                        background-color: #2775EA;
                        flex-direction: row;
                        justify-content: flex-end;
                        padding: 20px;
                    }
                    
                    .leftActionStrip {
                        width: 50%;
                        display: flex;
                        flex-direction: row;
                        justify-content: flex-start;
                        align-items: center;
                    }
                    
                    .rightActionStrip {
                        width: 50%;
                        display: flex;
                        flex-direction: row;
                        justify-content: flex-end;
                        align-items: center;
                    }
                    
                    .actionButtonGroup {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        margin: 1rem 0;
                    }
                    
                    .prevButton,
                    .nextButton {
                        padding: 0.5rem 1rem;
                        border-radius: 0.25rem;
                        border: none;
                        font-size: 1rem;
                        font-weight: bold;
                        background-color: #eee;
                        color: #333;
                        cursor: pointer;
                        outline: none;
                        transition: background-color 0.2s ease;
                        margin: 2px;
                    
                    }
                    
                    .prevButton[disabled],
                    .nextButton[disabled] {
                        opacity: 0.5;
                        cursor: default;
                    }
                    
                    .prevButton:hover,
                    .nextButton:hover {
                        background-color: #ddd;
                    }
                    .submitButton{
                        margin-left: 10px;
                        color: #2d87ff;
                        font-size: 18px;
                        font-weight: bold;
                        border-radius: 0.5em;
                        background: #e8e8e8;
                        border: 1px solid #e8e8e8;
                        transition: all .3s;
                        box-shadow: 6px 6px 12px #2163c7,
                                   -6px -6px 12px #2d87ff;
                    }
                    .submitButton:hover{
                        border: 1px solid #003E9C;
                    }
                    .submitButton:active {
                        box-shadow: 2px 2px 12px #2163c7,
                                   -2px -2px 12px #2d87ff;
                    }
                    `
                }
            </style>
        </div>
    )
}