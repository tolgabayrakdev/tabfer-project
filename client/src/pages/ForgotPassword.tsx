import { Box, Button, FormControl, FormLabel, Input, VStack, Heading, Text, Link as ChakraLink } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Geçersiz email').required('Email gerekli'),
});

const ForgotPassword = () => {
  return (
    <Box maxWidth="400px" margin="auto" mt={8}>
      <VStack spacing={8} align="stretch">
        <Heading textAlign="center">Şifremi Unuttum</Heading>
        <Formik
          initialValues={{ email: '' }}
          validationSchema={ForgotPasswordSchema}
          onSubmit={(values, actions) => {
            // Burada şifre sıfırlama işlemlerini gerçekleştirin
            console.log(values);
            setTimeout(() => {
              actions.setSubmitting(false);
              alert('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.');
            }, 1000);
          }}
        >
          {(props) => (
            <Form>
              <VStack spacing={4}>
                <Field name="email">
                  {({ field, form }: any) => (
                    <FormControl isInvalid={form.errors.email && form.touched.email}>
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <Input {...field} id="email" placeholder="Email" />
                      <Text color="red.500">{form.errors.email}</Text>
                    </FormControl>
                  )}
                </Field>
                <Button
                  mt={4}
                  colorScheme="blue"
                  isLoading={props.isSubmitting}
                  type="submit"
                  width="full"
                >
                  Şifre Sıfırlama Bağlantısı Gönder
                </Button>
              </VStack>
            </Form>
          )}
        </Formik>
        <Text textAlign="center">
          <ChakraLink as={RouterLink} to="/signin" color="blue.500">
            Giriş sayfasına dön
          </ChakraLink>
        </Text>
      </VStack>
    </Box>
  );
};

export default ForgotPassword;