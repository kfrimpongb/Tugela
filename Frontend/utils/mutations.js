import { gql } from "@apollo/client";

export const CREATE_USER = gql`
  mutation CreateUser($input: SignupInput!) {
    signup(data: $input) {
      message
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($input: data) {
    login(data: $input) {
      id
      accessToken
      refreshToken
    }
  }
`;

export const OTP_USER = gql`
  mutation OTPUser($input: VerifyOtpInput!) {
    verifyOtp(input: $input) {
      id
      accessToken
      refreshToken
    }
  }
`;

export const SEND_OTP = gql`
  mutation SendOtp($input: SendOtpInput!) {
    sendOtp(input: $input) {
      message
    }
  }
`;
