import { gql, type TypedDocumentNode } from "@apollo/client";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export type AuthPayload = {
  user: AuthUser;
  token: string;
};

export type SignInMutation = {
  signIn: AuthPayload;
};

export type SignInVariables = {
  input: {
    email: string;
    password: string;
  };
};

export type SignUpMutation = {
  signUp: AuthPayload;
};

export type SignUpVariables = {
  input: {
    name: string;
    email: string;
    password: string;
  };
};

export type SignOutMutation = {
  signOut: boolean;
};

export const SIGN_IN: TypedDocumentNode<SignInMutation, SignInVariables> = gql`
  mutation SignIn($input: SignInInput!) {
    signIn(input: $input) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

export const SIGN_UP: TypedDocumentNode<SignUpMutation, SignUpVariables> = gql`
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

export const SIGN_OUT: TypedDocumentNode<SignOutMutation> = gql`
  mutation SignOut {
    signOut
  }
`;
