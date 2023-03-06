import {IStepData, IStepIndexes, IStepper, TStep} from "./IStepper";
import {ISession} from "./ISession";
import Logger from "../utils/Logger";

export class Stepper implements IStepper {
    session: ISession;

    constructor(session: ISession) {
        this.session = session;
    }

    getCurrentStep(): IStepData | undefined {
        const {stepList} = this.session.state;

        if (stepList.length > 0) {
            const stepData: IStepData[] = stepList.filter(el => el.onStep === true);
            if (stepData.length > 0) {
                return stepData[0];
            }
        }
        return undefined;
    }

    addStep(step: string | number): void {
        const stepData: IStepData = {
            stepName: step,
            onStep: false,
            editing: false
        }
        this.session.setState({stepList: [...this.session.state.stepList, stepData]});
        return
    }

    addStepList(steps: IStepData[]): void {
        const {stepList} = this.session.state;
        if (stepList.length > 0) {
            return;
        }
        this.session.setState({stepList: steps})
    }

    getAllSteps(): IStepData {
        return this.session.state.stepList;
    }

    findStep(step: TStep): IStepData | undefined {
        const {stepList} = this.session.state;
        const stepIndex = stepList.findIndex(el => el.stepName === step);

        if (stepIndex === -1) {
            return undefined;
        }

        return stepList[stepIndex];
    }

    changeStep(data: IStepData): IStepData | undefined {
        const {stepList} = this.session.state;
        const stepIndex = stepList.findIndex(el => el.stepName === data.stepName);

        if (stepIndex === -1) {
            return undefined;
        }
        if(data.onStep === true){
            this._setPreviousOnStep(stepList);
        }

        stepList[stepIndex].onStep = data.onStep;
        stepList[stepIndex].editing = data.editing;
        this.session.setState({stepList});
        return stepList[stepIndex];
    }

    _setPreviousOnStep(stepList: IStepData[]): void {
        const currentStep = this.getCurrentStep();
        if (!currentStep) {
            return;
        }
        const stepIndex = stepList.findIndex(el => el.stepName === currentStep.stepName);
        stepList[stepIndex].onStep = false;
        this.session.setState({stepList});
    }

    setOnStep(step: TStep, status: boolean): IStepData | undefined {
        const {stepList} = this.session.state;
        const stepIndex = stepList.findIndex(el => el.stepName === step);

        if (stepIndex === -1) {
            return undefined;
        }
        this._setPreviousOnStep(stepList);

        stepList[stepIndex].onStep = status;
        this.session.setState({stepList});
        return stepList[stepIndex];
    }

    setStepEditing(step: TStep, status: boolean): IStepData | undefined {
        const {stepList} = this.session.state;
        const stepIndex = stepList.findIndex(el => el.stepName === step);

        if (stepIndex === -1) {
            return undefined;
        }

        stepList[stepIndex].editing = status;
        this.session.setState({stepList});
        return stepList[stepIndex];
    }

    nextUserStep(): void {
        const {stepList} = this.session.state;

        const stepIndexes = this._getNextStepIndex(stepList);
        if (stepIndexes && stepIndexes.nextStep) {
            return this.session.setState({userStep: stepList[stepIndexes.nextStep].stepName})
        }
        Logger.warn('User step not found. The first step in the list of steps is set.')
        return this.session.setState({userStep: stepList[0].stepName})
    }

    previousUserStep(): void {
        const {stepList} = this.session.state;

        const stepIndexes = this._getNextStepIndex(stepList);
        if (stepIndexes && stepIndexes.previousStep) {
            return this.session.setState({userStep: stepList[stepIndexes.previousStep].stepName})
        }
        Logger.warn('User step not found. The first step in the list of steps is set.')
        return this.session.setState({userStep: stepList[0].stepName})
    }

    _getNextStepIndex(stepList: IStepData[]): IStepIndexes | undefined {
        const currentUserStep: TStep = this.getUserStep();
        const stepIndexes: IStepIndexes = {
            nextStep: undefined,
            previousStep: undefined
        }

        if (currentUserStep) {
            const stepIndex = stepList.findIndex(el => el.stepName === currentUserStep);
            const nextStepIndex = stepIndex + 1;
            const previousStepIndex = stepIndex - 1;

            stepList[nextStepIndex] ? stepIndexes.nextStep = nextStepIndex : null;
            stepList[previousStepIndex] ? stepIndexes.nextStep = previousStepIndex : null;
            return stepIndexes;
        }

        return undefined;
    }

    setNextUserStep(step: TStep): void {
        const currentStep = this.findStep(step);
        if (currentStep) {
            return this.session.setState({userStep: currentStep.stepName});
        }
        Logger.warn('You are trying to set a non-existent step to the user. The step has not been set.')
        return;
    }

    removeNextUserStep(): void {
        return this.session.setState({userStep: null});
    }

    getUserStep(): TStep | undefined {
        const userStep: TStep = this.session.state.userStep;
        if (userStep) {
            return userStep;
        }
        return undefined;
    }
}

