export default interface MemberFetch {
  data: {
    username: string;
    name: string;
    email: string;
    memberID: string;
  };
  pgErrorObject: any;
  status: number;
  message: string;
}
