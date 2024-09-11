import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Button, Input, Grid, GridItem,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  FormControl, FormLabel, Select, useDisclosure, VStack, HStack, useToast,
  Text, Spinner, Badge, Textarea, Flex, useColorModeValue
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

type Contact = {
  id: string;
  name: string;
};

type Ticket = {
  id: string;
  assigneeId: string;
  subject: string;
  description: string;
  status: 'open' | 'closed';
  createdAt: string;
};

export default function Ticket() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed'>('all');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketsPerPage] = useState(8);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const getTicketCounts = useCallback(() => {
    const openCount = tickets.filter(t => t.status === 'open').length;
    const closedCount = tickets.filter(t => t.status === 'closed').length;
    const totalCount = openCount + closedCount;
    return { openCount, closedCount, totalCount };
  }, [tickets]);

  const fetchTickets = useCallback(async (page: number) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const sampleTickets: Ticket[] = Array.from({ length: 50 }, (_, index) => ({
      id: (index + 1).toString(),
      assigneeId: (Math.floor(Math.random() * 5) + 1).toString(),
      subject: `Ticket Subject ${index + 1}`,
      description: `Description for ticket ${index + 1}`,
      status: Math.random() > 0.5 ? 'open' : 'closed',
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
    }));
    const startIndex = (page - 1) * ticketsPerPage;
    const paginatedTickets = sampleTickets.slice(startIndex, startIndex + ticketsPerPage);
    setTickets(paginatedTickets);
    setTotalPages(Math.ceil(sampleTickets.length / ticketsPerPage));
    setIsLoading(false);
  }, [ticketsPerPage]);

  const fetchContacts = async () => {
    const sampleContacts: Contact[] = [
      { id: '1', name: 'John Doe' },
      { id: '2', name: 'Jane Smith' },
      { id: '3', name: 'Alice Johnson' },
      { id: '4', name: 'Bob Williams' },
      { id: '5', name: 'Charlie Brown' },
    ];
    setContacts(sampleContacts);
  };

  useEffect(() => {
    fetchTickets(currentPage);
    fetchContacts();
  }, [currentPage, fetchTickets]);

  const handleAdd = () => {
    setEditingTicket(null);
    onOpen();
  };

  const handleEdit = (ticket: Ticket) => {
    setEditingTicket(ticket);
    onOpen();
  };

  const handleDelete = async (id: string) => {
    setTickets(tickets.filter(ticket => ticket.id !== id));
    toast({
      title: 'Ticket silindi',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newTicket = {
      id: editingTicket?.id || Date.now().toString(),
      assigneeId: formData.get('assigneeId') as string,
      subject: formData.get('subject') as string,
      description: formData.get('description') as string,
      status: formData.get('status') as 'open' | 'closed',
      createdAt: editingTicket?.createdAt || new Date().toISOString(),
    };

    if (editingTicket) {
      setTickets(tickets.map(ticket => ticket.id === editingTicket.id ? newTicket : ticket));
      toast({
        title: 'Ticket güncellendi',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } else {
      setTickets([...tickets, newTicket]);
      toast({
        title: 'Yeni ticket eklendi',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }
    onClose();
  };

  const filteredTickets = tickets.filter(ticket => 
    statusFilter === 'all' ? true : ticket.status === statusFilter
  );

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const getStatusColor = (status: 'open' | 'closed') => {
    return status === 'open' ? 'green' : 'red';
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };

  // Renk moduna göre arka plan ve metin rengini ayarlayalım
  const bgColor = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');

  return (
    <Box>
      <HStack justifyContent="space-between" mb={4}>
        <Text fontWeight="bold">Toplam Ticket: {getTicketCounts().totalCount}</Text>
        <Text fontWeight="bold">Açık Ticket: {getTicketCounts().openCount}</Text>
        <Text fontWeight="bold">Kapalı Ticket: {getTicketCounts().closedCount}</Text>
      </HStack>

      <HStack justifyContent="space-between" mb={4}>
        <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={handleAdd}>
          Yeni Ticket Ekle
        </Button>
        <Select 
          w="200px" 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value as 'all' | 'open' | 'closed')}
        >
          <option value="all">Tümü</option>
          <option value="open">Açık</option>
          <option value="closed">Kapalı</option>
        </Select>
      </HStack>

      {isLoading ? (
        <Flex justify="center" align="center" minHeight="300px">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <>
          <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
            {filteredTickets.map((ticket) => (
              <GridItem key={ticket.id} bg={bgColor} p={5} shadow="md" borderWidth="1px" borderRadius="lg">
                <VStack align="stretch" spacing={3}>
                  <Flex justify="space-between" align="center">
                    <Badge colorScheme={getStatusColor(ticket.status)}>
                      {ticket.status === 'open' ? 'Açık' : 'Kapalı'}
                    </Badge>
                    <Text fontSize="sm" color="gray.500">ID: {ticket.id}</Text>
                  </Flex>
                  <Text fontWeight="bold" fontSize="lg" color={textColor}>{ticket.subject}</Text>
                  <Text fontSize="sm" noOfLines={2} color={textColor}>{ticket.description}</Text>
                  <Text fontSize="sm" color={textColor}>İlgili Kişi: {contacts.find(c => c.id === ticket.assigneeId)?.name || 'Bilinmiyor'}</Text>
                  <Text fontSize="sm" color="gray.500">Oluşturma Tarihi: {formatDate(ticket.createdAt)}</Text>
                  <HStack>
                    <Button size="sm" leftIcon={<EditIcon />} onClick={() => handleEdit(ticket)}>
                      Düzenle
                    </Button>
                    <Button size="sm" colorScheme="red" leftIcon={<DeleteIcon />} onClick={() => handleDelete(ticket.id)}>
                      Sil
                    </Button>
                  </HStack>
                </VStack>
              </GridItem>
            ))}
          </Grid>

          <HStack justifyContent="center" mt={6}>
            <Button
              onClick={() => paginate(currentPage - 1)}
              isDisabled={currentPage === 1}
              leftIcon={<ChevronLeftIcon />}
            >
              Önceki
            </Button>
            <Text>{`Sayfa ${currentPage} / ${totalPages}`}</Text>
            <Button
              onClick={() => paginate(currentPage + 1)}
              isDisabled={currentPage === totalPages}
              rightIcon={<ChevronRightIcon />}
            >
              Sonraki
            </Button>
          </HStack>
        </>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={bgColor}>
          <form onSubmit={handleSubmit}>
            <ModalHeader color={textColor}>{editingTicket ? 'Ticket Düzenle' : 'Yeni Ticket Ekle'}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel color={textColor}>İlgili Kişi</FormLabel>
                  <Select name="assigneeId" defaultValue={editingTicket?.assigneeId} bg={bgColor} color={textColor}>
                    {contacts.map(contact => (
                      <option key={contact.id} value={contact.id}>{contact.name}</option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel color={textColor}>Konu</FormLabel>
                  <Input name="subject" defaultValue={editingTicket?.subject} bg={bgColor} color={textColor} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel color={textColor}>Açıklama</FormLabel>
                  <Textarea name="description" defaultValue={editingTicket?.description} bg={bgColor} color={textColor} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel color={textColor}>Durum</FormLabel>
                  <Select name="status" defaultValue={editingTicket?.status || 'open'} bg={bgColor} color={textColor}>
                    <option value="open">Açık</option>
                    <option value="closed">Kapalı</option>
                  </Select>
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} type="submit">
                Kaydet
              </Button>
              <Button onClick={onClose}>İptal</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
}