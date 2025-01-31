import { useState, useEffect } from "react";
import {
  Box,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  FormHelperText,
  Flex,
  useToast,
  Heading,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { DarkModeToggler } from '../components/ui/toggler';

const Login = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [password, setPassword] = useState("");
  // const credentials = ["bob@gmail.com", "123"];
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  async function fetchData(email, password) {
    try {
      
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      })

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setStatus("failed");
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData(email, password);
  };

  useEffect(() => {
    if (status == "failed") {
      toast({
        title: "Login Failed",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setStatus("");
  }, [status]);

  return (
    <>
        <Box mt={0} my={5}>
          <Heading>Login</Heading>
        </Box>
        <Box minWidth={["300px", "400px"]}>
          <form onSubmit={handleSubmit}>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input type="email" value={email} onChange={handleEmailChange} />
              {email ? (
                <FormErrorMessage>Email is required.</FormErrorMessage>
              ) : (
                <FormHelperText>Enter your email.</FormHelperText>
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
            <Button type="submit" mt={6} width="100%">
              Login
            </Button>
          </form>
          <Box pt={5} textAlign="center" _hover={{ cursor: "pointer", textDecoration: "underline"}} >
            <a href="/signup">Don't have an account?</a>
          </Box>
        </Box>
    </>
  );
};

export default Login;
