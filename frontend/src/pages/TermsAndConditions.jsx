import React from "react";
import { Box, Heading, Text, Link, VStack, Divider } from "@chakra-ui/react";

const TermsAndConditions = () => {
  return (
    <Box p={5} maxWidth="900px" margin="0 auto">
      <VStack spacing={6} align="start">
        <Heading as="h1" size="2xl">Terms & Conditions</Heading>

        <Section title="1. Introduction">
          <Text>
            Welcome to MoneyTiger! By accessing and using our services, you agree to be bound by these Terms and Conditions. Please read them carefully. These Terms & Conditions govern your access to and use of the MoneyTiger services, including our website, mobile apps, and any other products or services we provide (collectively, "Services").
          </Text>
        </Section>

        <Section title="2. Personal Data Collection & Usage">
          <Text>
            In accordance with the Personal Data Protection Act 2010 (PDPA), we are committed to protecting your privacy. By using our Services, you consent to the collection, use, and sharing of your personal data as described in this notice.
          </Text>
          <Text fontWeight="bold" mt={3}>Personal Data We Collect:</Text>
          <Text>
            We collect the following personal data when you register for an account or use our services:
          </Text>
          <Text>- Name</Text>
          <Text>- Email</Text>
          <Text>- Phone Number</Text>
          <Text>- Address</Text>
          <Text>- Age</Text>
          <Text>- Account Type (e.g., Savings, Checking)</Text>
          <Text>- Password (encrypted)</Text>

          <Text fontWeight="bold" mt={3}>Purpose of Data Collection:</Text>
          <Text>
            We collect your personal data for the following purposes:
          </Text>
          <Text>- To provide and manage your account on MoneyTiger</Text>
          <Text>- To process transactions and ensure the security of your account</Text>
          <Text>- To communicate with you about your account, promotions, and updates</Text>
          <Text>- For marketing purposes (if you opt-in)</Text>
          <Text>- To comply with legal obligations</Text>

          <Text fontWeight="bold" mt={3}>Source of Data:</Text>
          <Text>
            We collect personal data directly from you through our website and applications.
          </Text>
        </Section>

        <Section title="3. Your Rights Under PDPA">
          <Text fontWeight="bold">Right to Access and Correct Your Personal Data:</Text>
          <Text>
            Under the PDPA, you have the right to access and request correction of your personal data. If you believe that any information we hold about you is incorrect or incomplete, please contact us at [support@moneytiger.com], and we will take reasonable steps to correct it.
          </Text>

          <Text fontWeight="bold" mt={3}>Choice to Limit Processing:</Text>
          <Text>
            You have the right to limit the processing of your personal data. You can choose to opt-out of marketing communications or other data uses not essential to the services we provide. You can make such requests by contacting us directly at [support@moneytiger.com].
          </Text>

          <Text fontWeight="bold" mt={3}>Right to Withdraw Consent:</Text>
          <Text>
            You have the right to withdraw your consent for the processing of your personal data. If you wish to withdraw consent, please contact us, and we will stop processing your personal data unless required by law.
          </Text>
        </Section>

        <Section title="4. Disclosure of Personal Data">
          <Text>
            We may disclose your personal data to third parties in the following circumstances:
          </Text>
          <Text>- With service providers: We may share your data with third-party service providers to help us operate our business (e.g., payment processors, customer support).</Text>
          <Text>- For legal purposes: We may disclose your data to comply with any legal obligations or respond to legal claims.</Text>
          <Text>- With your consent: We may disclose your data to other parties if you provide us with explicit consent.</Text>
        </Section>

        <Section title="5. Security of Personal Data">
          <Text>
            We take reasonable security measures to protect your personal data from unauthorized access, loss, misuse, or alteration. These include physical, administrative, and technical safeguards. However, we cannot guarantee the complete security of your data over the internet.
          </Text>
        </Section>

        <Section title="6. Data Retention">
          <Text>
            We will retain your personal data for as long as necessary to fulfill the purposes outlined in this agreement unless a longer retention period is required or permitted by law.
          </Text>
        </Section>

        <Section title="7. Obligatory vs. Voluntary Data Provision">
          <Text>
            You are required to provide certain personal data for registration and account creation purposes. Failure to provide the required data may result in an inability to use some or all of our services. Other personal data, such as marketing preferences, are provided voluntarily.
          </Text>
        </Section>

        <Section title="8. Changes to Terms & Conditions">
          <Text>
            We may update these Terms & Conditions from time to time. Any changes will be posted on this page with an updated revision date. You are encouraged to review this page periodically to stay informed of any changes.
          </Text>
        </Section>

        <Section title="9. Contact Us">
          <Text>
            If you have any questions or concerns about our Terms & Conditions or our handling of your personal data, please contact us at:
          </Text>
          <Text>Email: [support@moneytiger.com]</Text>
          <Text>Phone: [1300888333]</Text>
          <Text>Address: [123 Main Street, Anytown, USA]</Text>
        </Section>

        <Divider mt={6} />
        <Text textAlign="center">
          By using our services, you acknowledge that you have read, understood, and agreed to these Terms & Conditions.
        </Text>
      </VStack>
    </Box>
  );
};

const Section = ({ title, children }) => (
  <Box>
    <Heading size="md" mt={4}>{title}</Heading>
    {children}
  </Box>
);

export default TermsAndConditions;
