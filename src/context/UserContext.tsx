import React, {createContext, useState} from 'react';

export const UserContext = createContext({
  user: {
    email: '',
    password: '',
  },
  setUser: (data: any) => {},
});

const UserProvider: React.FC = ({children}) => {
  const [user, setUser] = useState({email: '', password: ''});

  return (
    <UserContext.Provider value={{user, setUser}}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
