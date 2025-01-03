import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flex, Heading, VStack, Box, Spinner, Text, Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer } from "@chakra-ui/react";
import { jwtDecode } from "jwt-decode";
const Dashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);
    const [userData, setUserData] = useState(null);
    const [transactionHistory, setTransactionHistory] = useState([]);

    useEffect(() => {
        const verifyUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/"); // Redirect to login page if no token
                return;
            }

            try {
                const dashboardResponse = await fetch("http://localhost:3005/api/auth/dashboard-data", {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (dashboardResponse.ok) {
                    setAuthorized(true);
                    const decodedToken = jwtDecode(token); // Decoding the token to get user info
                    const userId = decodedToken.id; // Extracting the user ID from the decoded token

                    // Fetch user profile data using the decoded user ID
                    const profileResponse = await fetch(`http://localhost:3005/api/users/profile/${userId}`, {
                        method: "GET",
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    if (profileResponse.ok) {
                        const data = await profileResponse.json();
                        setUserData(data);
                        console.log("User Data:", data);
                    } else {
                        console.error("Failed to fetch profile data");
                    }
                    
                    // Get transaction data using user ID   
                    const transactionResponse = await fetch(`http://localhost:3005/api/users/transactions/${userId}`, {
                        method: "GET",
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    if (transactionResponse.ok) {
                        const data = await transactionResponse.json();
                        // console.log("transaction data", data)
                        setTransactionHistory(data);
                    }
                    else {
                        console.log("No transaction history")
                    }

                } else {
                    navigate("/"); // Redirect if unauthorized
                }
            } catch (error) {
                console.error("Error verifying user:", error);
                navigate("/");
            } finally {
                setLoading(false);
            }
        };

        verifyUser();
    }, [navigate]);

    if (loading) {
        return (
            <Flex align="center" justify="center" width="100%" height="100vh">
                <Spinner size="xl" />
            </Flex>
        );
    }

    if (!authorized) {
        return null; // Render nothing while redirecting
    }

    return (
        <Flex align="center" justify="center" width="100%" height="100vh">
            <VStack spacing={4}>
                <Box>
                    <Heading>Dashboard</Heading>
                </Box>
                {userData && (
                    <Box>
                        <Text>Welcome, {userData.Name}!</Text>
                        <Text>Email: {userData.Email}</Text>
                        <Text>Contact: {userData.Contact}</Text>
                        <Text>Account Type: {userData.AccountType}</Text>
                    </Box>
                )}
        
                <TableContainer>
                    <Table variant='striped'>
                        <TableCaption>Past Transactions</TableCaption>
                        <Thead>
                            <Tr>
                                <Th>Sender</Th>
                                <Th>Receiver</Th>
                                <Th isNumeric>Amount</Th>
                                <Th>Transaction Date</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {transactionHistory.length !== 0 && transactionHistory.map((transaction, index) => (
                                <Tr key={index}>
                                    <Td>{transaction.SenderName}</Td>
                                    <Td>{transaction.ReceiverName}</Td>
                                    <Td isNumeric>{transaction.TransactionAmount.toFixed(2)}</Td>
                                    <Td>{new Date(transaction.TransactionDate).toLocaleDateString()}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </VStack>
        </Flex>

        )
    ;
};

export default Dashboard;
