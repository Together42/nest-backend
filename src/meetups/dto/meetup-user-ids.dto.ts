import UserRole from "src/user/enum/user.enum";

export class MeetupUserIdsDto {
  meetupId: number;
  userId: number;
  userRole?: UserRole;
}
