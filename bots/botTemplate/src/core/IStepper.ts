export type TStep = string | number;

export interface IStepIndexes {
    nextStep: number | undefined;
    previousStep: number | undefined;
}

export interface IStepData {
    stepName: string | number;
    onStep: boolean;
    editing: boolean;
}

export interface IStepper {
    addStep(step: TStep): void;
    addStepList(steps: IStepData[]): void
    getCurrentStep(): IStepData | void;
    findStep(step: TStep): IStepData | undefined;
    setOnStep(step: TStep, status: boolean): IStepData | undefined;
    setStepEditing(step: TStep, status: boolean): IStepData | undefined;
    changeStep(data: IStepData): IStepData | undefined;
    getAllSteps(): IStepData; //Get all user steps.

    nextUserStep(): void; //Set the user's next step automatically.
    previousUserStep(): void; //Set the user's previous step automatically.
    setNextUserStep(step: TStep): void; //Set a specific user step.
    getUserStep(): TStep | undefined; //Get the user's current step. (undefined - if the step was not set)
    removeNextUserStep(): void; //Delete a user step.
}