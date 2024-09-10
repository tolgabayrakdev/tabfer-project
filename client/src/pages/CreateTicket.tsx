import React, { useState } from 'react'
import {
  Box,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useToast,
} from '@chakra-ui/react'

const CreateTicket = () => {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const toast = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Burada ticket oluşturma API'si çağrılacak
    console.log('Ticket oluşturuldu:', { subject, message, email })
    toast({
      title: 'Ticket oluşturuldu',
      description: 'Destek ekibimiz en kısa sürede size dönüş yapacaktır.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    })
    setSubject('')
    setMessage('')
    setEmail('')
  }

  return (
    <Box maxWidth="600px" margin="auto" padding={8}>
      <Heading mb={6}>Destek Talebi Oluştur</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>E-posta</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-posta adresinizi girin"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Konu</FormLabel>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Sorununuzu kısaca özetleyin"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Mesaj</FormLabel>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Sorununuzu detaylı bir şekilde açıklayın"
              rows={5}
            />
          </FormControl>
          <Button type="submit" colorScheme="blue">
            Ticket Oluştur
          </Button>
        </VStack>
      </form>
    </Box>
  )
}

export default CreateTicket