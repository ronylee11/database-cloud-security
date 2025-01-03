import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flex, Heading, VStack, Box, Spinner } from "@chakra-ui/react";

const Dashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const verifyUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/"); // Redirect to login page
                return;
            }

            try {
                const response = await fetch("http://localhost:3004/api/auth/dashboard-data", {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.ok) {
                    setAuthorized(true);
                } else {
                    navigate("/");
                }
            } catch (error) {
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
                <Spinner />
            </Flex>
        );
    }

    if (!authorized) {
        return null; // Render nothing while redirecting
    }

    return (
        <Flex align="center" justify="center" width="100%" height="100vh">
            <VStack>
                <Box>
                    <Heading>Dashboard</Heading>
                </Box>
            </VStack>
        </Flex>
    );
};

export default Dashboard;
