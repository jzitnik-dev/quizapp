const roles: {
  [key: string]: {
    color: "indigo" | "red";
    text: string;
  }
} = {
  "ROLE_USER": {
    color: "indigo",
    text: "Uživatel"
  },
  "ROLE_ADMIN": {
    color: "red",
    text: "Admin"
  }
};

export default roles;
