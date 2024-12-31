import { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  FormHelperText,
  Flex,
  useToast,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";

const Register = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [status, setStatus] = useState("");

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [address, setAddress] = useState("");
  const [age, setAge] = useState();
  const [accountType, setAccountType] = useState("Savings")
  const [error, setError] = useState()

  const handlePhoneNumChange = (e) => setPhoneNum(e.target.value)
  const handleAddressChange = (e) => setAddress(e.target.value)
  const handleAgeChange = (e) => setAge(e.target.value)
  const handleNameChange = (e) => setName(e.target.value)
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  async function fetchData() {
    try {
      const json_data = {
        email: email,
        password: password,
        name: name,
        phoneNum: phoneNum,
        address: address,
        age: age,
        accountType: accountType
      }
      console.log(json_data)

      const response = await fetch("http://localhost:3001/api/users", {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(json_data)
      })

      const data = await response.json();
      if (response.status === 201) {
        setStatus("success");
      } else {
        setError(data.message)
        setStatus("failed");
      }
    }
    catch (err) {
      console.error(err)
      setError(err)
      setStatus("failed");
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();

    // need help on this one, doesnt reset for some reason
    if (status === "success") {
      setEmail("")
      setName("")
      setPassword("")
      setPhoneNum("")
      setAddress("")
    }
  };

  useEffect(() => {
    if (status === "success") {
      toast({
        title: "Registration success",
        status: "success",
        duration: 3000,
        isClosable: true
      });
    }
    else if (status === "failed") {
      toast({
        title: `Registration failed: ${error}`,
        status: "error",
        duration: 3000,
        isClosable: true
      });
    }

    // for avoiding repeated toasts
    setStatus("");
  }, [status]);

  return (
    <>
      <Flex alignItems="center" justifyContent="center">
        <Heading mb={-10} p={5}>MoneyTiger</Heading>
      </Flex>
      <Flex
        alignItems="center"
        justifyContent="center"
        flexDir="column"
        width="100vw"
        height="100vh"
      >
        <Box>
          <Heading mb={5}>Register your Account</Heading>
        </Box>
        <Box minWidth={["300px", "400px"]}>
          <form onSubmit={handleSubmit}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input type="text" value={name} onChange={handleNameChange} />
              {name ? (
                <FormErrorMessage>Name is required.</FormErrorMessage>
              ) : (
                <FormHelperText>Enter your name.</FormHelperText>
              )}
            </FormControl>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input type="email" value={email} onChange={handleEmailChange} />
              {email ? (
                <FormErrorMessage>Email is required.</FormErrorMessage>
              ) : (
                <FormHelperText>Enter your email.</FormHelperText>
              )}
            </FormControl>

            <FormControl>
              <FormLabel>Phone Number</FormLabel>
              <Input type="text" value={phoneNum} onChange={handlePhoneNumChange} />
              {phoneNum ? (
                <FormErrorMessage>Phone number is required.</FormErrorMessage>
              ) : (
                <FormHelperText>Enter your contact details.</FormHelperText>
              )}
            </FormControl>

            <FormControl>
              <FormLabel>Address</FormLabel>
              <Input type="text" value={address} onChange={handleAddressChange} />
              {address ? (
                <FormErrorMessage>Address is required.</FormErrorMessage>
              ) : (
                <FormHelperText>Enter your address.</FormHelperText>
              )}
            </FormControl>

            <FormControl>
              <FormLabel>Age</FormLabel>
              <Input type="number" value={age} onChange={handleAgeChange} />
              {age ? (
                <FormErrorMessage>Age is required.</FormErrorMessage>
              ) : (
                <FormHelperText>Enter your age.</FormHelperText>
              )}
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={handlePasswordChange}
              />
              {password ? (
                <FormErrorMessage>Password is required.</FormErrorMessage>
              ) : (
                <FormHelperText>Enter your password.</FormHelperText>
              )}
            </FormControl>

            <FormControl>
              <FormLabel>Account Type</FormLabel>
              <Menu>
                {({ isOpen }) => (
                  <>
                    <MenuButton isActive={isOpen} as={Button} >
                      {accountType}
                    </MenuButton>
                    <MenuList>
                      <MenuItem onClick={() => setAccountType("Savings")}>Savings</MenuItem>
                      <MenuItem onClick={() => setAccountType("Checking")}>Checking</MenuItem>
                      
                    </MenuList>
                  </>
                )}
              </Menu>
            </FormControl>

            <Button type="submit" mt={6} width="100%">
              Register
            </Button>
          </form>
        </Box>
      </Flex>
    </>
  );
};

export default Register;
