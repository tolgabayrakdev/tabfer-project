import { Flex, Heading, Button } from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";

type Props = {}

export default function Home({ }: Props) {
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoggedIn = async () => {
            const res = await fetch('http://localhost:8000/api/v1/auth/verify', {
                method: 'POST',
                credentials: 'include',
            });
            if (res.status === 200) {
                navigate('/dashboard')
            }
        }
        checkLoggedIn();
    }, [])
    return (
        <Flex direction="column" justify="center" h="100vh" align="center">
            <Heading
                display="inline-block"
                as="h1"
                size="xl"
                bgGradient="linear(to-r, blue.400, blue.600)"
                backgroundClip="text"
            >
                Hoşgeldin
            </Heading>

            <Button
                mt="6"
                colorScheme="blue"
                bgGradient="linear(to-r, blue.400, blue.500, blue.600)"
                color="white"
                variant="solid"
                as={RouterLink}
                to="/signin"
            >
                Giriş yap
            </Button>
        </Flex>
    )
}