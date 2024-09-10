import React, { useState, useEffect } from 'react'
import {
  Box,
  Heading,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
  Textarea,
} from '@chakra-ui/react'

interface Ticket {
  id: number;
  subject: string;
  message: string;
  email: string;
  status: 'open' | 'closed';
  createdAt: string;
}

const CustomerSupport = () => {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [reply, setReply] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    // Burada ticket'ları çeken API çağrısı yapılacak
    // Örnek veri:
    setTickets([
      { id: 1, subject: 'Ürün Sorunu', message: 'Ürünüm çalışmıyor', email: 'user@example.com', status: 'open', createdAt: '2024-03-15' },
      { id: 2, subject: 'Fatura Sorunu', message: 'Faturamda hata var', email: 'user2@example.com', status: 'open', createdAt: '2024-03-16' },
    ])
  }, [])

  const handleReply = () => {
    if (selectedTicket) {
      // Burada yanıt gönderme API çağrısı yapılacak
      console.log('Yanıt gönderildi:', { ticketId: selectedTicket.id, reply })
      // Ticket durumunu güncelle
      setTickets(tickets.map(ticket => 
        ticket.id === selectedTicket.id ? { ...ticket, status: 'closed' as const } : ticket
      ))
      onClose()
      setReply('')
    }
  }

  return (
    <Box>
      <Heading mb={6}>Müşteri Destek Ticketları</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Konu</Th>
            <Th>E-posta</Th>
            <Th>Durum</Th>
            <Th>Tarih</Th>
            <Th>İşlem</Th>
          </Tr>
        </Thead>
        <Tbody>
          {tickets.map((ticket) => (
            <Tr key={ticket.id}>
              <Td>{ticket.subject}</Td>
              <Td>{ticket.email}</Td>
              <Td>{ticket.status === 'open' ? 'Açık' : 'Kapalı'}</Td>
              <Td>{ticket.createdAt}</Td>
              <Td>
                <Button onClick={() => {
                  setSelectedTicket(ticket)
                  onOpen()
                }}>
                  Görüntüle/Yanıtla
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Ticket Detayı</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedTicket && (
              <VStack align="stretch" spacing={4}>
                <Text><strong>Konu:</strong> {selectedTicket.subject}</Text>
                <Text><strong>Mesaj:</strong> {selectedTicket.message}</Text>
                <Text><strong>E-posta:</strong> {selectedTicket.email}</Text>
                <Text><strong>Durum:</strong> {selectedTicket.status === 'open' ? 'Açık' : 'Kapalı'}</Text>
                <Textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Yanıtınızı buraya yazın"
                />
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleReply}>
              Yanıtla ve Kapat
            </Button>
            <Button variant="ghost" onClick={onClose}>İptal</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default CustomerSupport