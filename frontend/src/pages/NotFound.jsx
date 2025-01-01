import React from "react";
import { Flex, Heading, Button, VStack, Box } from "@chakra-ui/react";

const NotFound = () => {
  return (
    <Flex align="center" justify="center" width={"100%"} height={"100vh"}>
      <VStack>
        <Box paddingBottom="0.5rem">
          <Heading>Page Not Found</Heading>
        </Box>
        <Box>
          <Button
            href="/"
            as="a"
          >
            Go back to home page
          </Button>
        </Box>
      </VStack>
    </Flex>
  );
};

export default NotFound;