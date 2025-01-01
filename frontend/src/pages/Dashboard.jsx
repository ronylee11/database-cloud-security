import React from "react";
import { Flex, Heading, Button, VStack, Box } from "@chakra-ui/react";

const Dashboard = () => {
  return (
    <Flex align="center" justify="center" width={"100%"} height={"100vh"}>
      <VStack>
        <Box paddingBottom="0.5rem">
        </Box>
        <Box>
        <Heading>dashboard</Heading>
        </Box>
      </VStack>
    </Flex>
  );
};

export default Dashboard;