export interface IKeyboardButton {
    name: string;
    value: string;
    notDisplayedValue: string;
}

export interface IKeyboard {
    [index: number]: IKeyboardButton;
}