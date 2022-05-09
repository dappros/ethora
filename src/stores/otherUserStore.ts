import {makeAutoObservable, runInAction} from 'mobx';
export class OtherUserStore {
  userAvatar = '';
  description = 'Test Desc';
  firstName = '';
  lastName = '';
  anotherUserLastSeen = {};
  transactions = [];

  constructor() {
    makeAutoObservable(this);
  }

  setInitialState(){
    this.userAvatar = '';
    this.description = 'Test Desc';
    this.firstName = '';
    this.lastName = '';
    this.anotherUserLastSeen = {};
    this.transactions = [];
  }

  setDataFromVCard(description:string, avatar:string) {
    console.log(avatar)
    runInAction(() => {
      this.userAvatar = avatar;
      this.description = description;
    });
  }

  setUserData = (firstName:string, lastName:string, avatar:string) => {
    runInAction(() => {
      this.userAvatar = avatar;
      this.firstName = firstName;
      this.lastName = lastName;
    });
  };
}
