type emptyObject = Record<string, never>;

export class NotFoundMeetupDto {
  event: emptyObject;
  teamList: emptyObject;

  constructor() {
    this.event = {};
    this.teamList = {};
  }
}
