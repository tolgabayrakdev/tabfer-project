import { Box, Button, FormControl, FormLabel, Input, VStack, Heading, Text, Link as ChakraLink } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const SignUpSchema = Yup.object().shape({
  name: Yup.string().required('İsim gerekli'),
  email: Yup.string().email('Geçersiz email').required('Email gerekli'),
  password: Yup.string().min(6, 'Şifre en az 6 karakter olmalı').required('Şifre gerekli'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Şifreler eşleşmiyor')
    .required('Şifre onayı gerekli'),
});

const SignUp = () => {
  const navigate = useNavigate();

  return (
    <Box maxWidth="400px" margin="auto" mt={8}>
      <VStack spacing={8} align="stretch">
        <Heading textAlign="center">Kayıt Ol</Heading>
        <Formik
          initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
          validationSchema={SignUpSchema}
          onSubmit={(values, actions) => {
            // Burada kayıt işlemlerini gerçekleştirin
            console.log(values);
            setTimeout(() => {
              actions.setSubmitting(false);
              navigate('/signin');
            }, 1000);
          }}
        >
          {(props) => (
            <Form>
              <VStack spacing={4}>
                <Field name="name">
                  {({ field, form }: any) => (
                    <FormControl isInvalid={form.errors.name && form.touched.name}>
                      <FormLabel htmlFor="name">İsim</FormLabel>
                      <Input {...field} id="name" placeholder="İsim" />
                      <Text color="red.500">{form.errors.name}</Text>
                    </FormControl>
                  )}
                </Field>
                <Field name="email">
                  {({ field, form }: any) => (
                    <FormControl isInvalid={form.errors.email && form.touched.email}>
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <Input {...field} id="email" placeholder="Email" />
                      <Text color="red.500">{form.errors.email}</Text>
                    </FormControl>
                  )}
                </Field>
                <Field name="password">
                  {({ field, form }: any) => (
                    <FormControl isInvalid={form.errors.password && form.touched.password}>
                      <FormLabel htmlFor="password">Şifre</FormLabel>
                      <Input {...field} id="password" type="password" placeholder="Şifre" />
                      <Text color="red.500">{form.errors.password}</Text>
                    </FormControl>
                  )}
                </Field>
                <Field name="confirmPassword">
                  {({ field, form }: any) => (
                    <FormControl isInvalid={form.errors.confirmPassword && form.touched.confirmPassword}>
                      <FormLabel htmlFor="confirmPassword">Şifre Onayı</FormLabel>
                      <Input {...field} id="confirmPassword" type="password" placeholder="Şifre Onayı" />
                      <Text color="red.500">{form.errors.confirmPassword}</Text>
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
                  Kayıt Ol
                </Button>
              </VStack>
            </Form>
          )}
        </Formik>
        <Text textAlign="center">
          Zaten hesabınız var mı?{' '}
          <ChakraLink as={RouterLink} to="/signin" color="blue.500">
            Giriş Yap
          </ChakraLink>
        </Text>
      </VStack>
    </Box>
  );
};

export default SignUp;