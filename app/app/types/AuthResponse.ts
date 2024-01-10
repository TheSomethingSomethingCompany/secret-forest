export default interface SignUpResponse {
  data: {
    id: string;
  } | null;
  status: number;
  message: string;
  pgErrorObject: any;
}
