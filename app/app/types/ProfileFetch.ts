export default interface MemberFetch {
  data: {
    name: string;
    country: string;
    bio: string;
  };
  pgErrorObject: any;
  status: number;
  message: string;
}
