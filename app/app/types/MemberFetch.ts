export default interface MemberFetch {
  data: {
    username: string;
    name: string;
    email: string;
    memberID: string;
    country: string;
    bio: string;
    address: string;
    tags: never[];
  };
  pgErrorObject: any;
  status: number;
  message: string;
}
