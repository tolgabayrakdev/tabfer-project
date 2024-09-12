import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box, Button, Input, Grid, GridItem,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  FormControl, FormLabel, Select, useDisclosure, VStack, HStack, useToast,
  Text, Spinner, Badge, Textarea, Flex, useColorModeValue,
  AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Helmet } from 'react-helmet-async';

type Contact = {
  id: string;
  first_name: string;
  last_name: string;
};

type Ticket = {
  id: string;
  contact_id: string;
  subject: string;
  description: string;
  status: 'open' | 'closed';
  created_at: string;
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
  const [isContactsLoading, setIsContactsLoading] = useState(true);
  const [deleteAlert, setDeleteAlert] = useState<{ isOpen: boolean; ticketId: string | null }>({ isOpen: false, ticketId: null });
  const cancelRef = useRef<HTMLButtonElement>(null);

  const fetchTickets = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/ticket', {
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Tickets fetching failed');
      const data = await res.json();
      setTickets(data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast({
        title: 'Error fetching tickets',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const fetchContacts = async () => {
    setIsContactsLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/contact', {
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Contacts fetching failed');
      const data = await res.json();
      setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast({
        title: 'Error fetching contacts',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsContactsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchContacts();
  }, [fetchTickets]);

  const handleAdd = () => {
    setEditingTicket(null);
    onOpen();
  };

  const handleEdit = (ticket: Ticket) => {
    setEditingTicket(ticket);
    onOpen();
  };

  const handleDelete = (id: string) => {
    setDeleteAlert({ isOpen: true, ticketId: id });
  };

  const confirmDelete = async () => {
    if (deleteAlert.ticketId) {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/ticket/${deleteAlert.ticketId}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (!res.ok) throw new Error('Ticket deletion failed');

        await fetchTickets();

        toast({
          title: 'Ticket silindi',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: 'Silme işlemi başarısız',
          description: (error as Error).message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
    setDeleteAlert({ isOpen: false, ticketId: null });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newTicket = {
      contact_id: formData.get('contact_id') as string,
      subject: formData.get('subject') as string,
      description: formData.get('description') as string,
      status: formData.get('status') as 'open' | 'closed',
    };

    try {
      const url = editingTicket
        ? `http://localhost:8000/api/v1/ticket/${editingTicket.id}`
        : 'http://localhost:8000/api/v1/ticket';
      const method = editingTicket ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTicket),
        credentials: 'include',
      });

      if (!res.ok) throw new Error(editingTicket ? 'Ticket update failed' : 'Ticket creation failed');

      await fetchTickets();

      toast({
        title: editingTicket ? 'Ticket güncellendi' : 'Yeni ticket eklendi',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Bir hata oluştu',
        description: (error as Error).message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const filteredTickets = tickets.filter(ticket =>
    statusFilter === 'all' ? true : ticket.status === statusFilter
  );

  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getStatusColor = (status: 'open' | 'closed') => {
    return status === 'open' ? 'green' : 'red';
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };

  const bgColor = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');

  return (
    <>
      <Helmet>
        <title>Tickets - Dashboard</title>
      </Helmet>
      <Box>
        <HStack justifyContent="space-between" mb={4}>
          <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={handleAdd}>
            Yeni Bilet Ekle
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

        {isLoading || isContactsLoading ? (
          <Flex justify="center" align="center" minHeight="300px">
            <Spinner size="xl" />
          </Flex>
        ) : (
          <>
            <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
              {currentTickets.map((ticket) => (
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
                    <Text fontSize="sm" color={textColor}>İlgili Kişi: {contacts.find(c => c.id === ticket.contact_id)?.first_name + ' ' + contacts.find(c => c.id === ticket.contact_id)?.last_name || 'Bilinmiyor'}</Text>
                    <Text fontSize="sm" color="gray.500">Oluşturma Tarihi: {formatDate(ticket.created_at)}</Text>
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
              <ModalHeader color={textColor}>{editingTicket ? 'Bilet Düzenle' : 'Yeni Bilet Ekle'}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel color={textColor}>İlgili Kişi</FormLabel>
                    <Select name="contact_id" defaultValue={editingTicket?.contact_id} bg={bgColor} color={textColor}>
                      {contacts.map(contact => (
                        <option key={contact.id} value={contact.id}>{contact.first_name} {contact.last_name}</option>
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

        <AlertDialog
          isOpen={deleteAlert.isOpen}
          leastDestructiveRef={cancelRef}
          onClose={() => setDeleteAlert({ isOpen: false, ticketId: null })}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Bileti Sil
              </AlertDialogHeader>

              <AlertDialogBody>
                Bu işlem geri alınamaz. Bu bileti silmek istediğinizden emin misiniz?
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={() => setDeleteAlert({ isOpen: false, ticketId: null })}>
                  İptal
                </Button>
                <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                  Sil
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Box>
    </>

  );
}