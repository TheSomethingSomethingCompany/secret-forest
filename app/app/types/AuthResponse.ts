export default interface AuthResponse {
  data: {
    id: string;
  } | null;
  status: number;
  message: string;
}
