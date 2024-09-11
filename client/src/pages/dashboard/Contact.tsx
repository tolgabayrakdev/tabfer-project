import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Button, Input, Table, Thead, Tbody, Tr, Th, Td,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  FormControl, FormLabel, useDisclosure, VStack, HStack, useToast,
  AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay,
  Text
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

type Contact = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
};

export default function Contact() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchText, setSearchText] = useState('');
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [contactsPerPage] = useState(8);

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    fetchContacts()
  },[])

  const fetchContacts = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/contact", {
        method: "GET",
        credentials: "include"
      });
      const data = await res.json();
      console.log(data);
      
      if (res.status === 200) {
        setContacts(data);
      }
    } catch (error) {
      throw error;
    }
  };
  

  const handleAdd = () => {
    setEditingContact(null);
    onOpen();
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    onOpen();
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    onAlertOpen();
  };

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      await handleDelete(deleteId);
      setDeleteId(null);
      onAlertClose();
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/contact/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        setContacts(contacts.filter(contact => contact.id !== id));
        toast({
          title: 'Kişi silindi',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } else {
        throw new Error('Kişi silinirken bir hata oluştu');
      }
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newContact: Omit<Contact, 'id'> = {
      first_name: formData.get('name') as string,
      last_name: formData.get('surname') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
    };

    try {
      if (editingContact) {
        const res = await fetch(`http://localhost:8000/api/v1/contact/${editingContact.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newContact),
          credentials: 'include',
        });

        if (res.ok) {
          const updatedContact = await res.json();
          setContacts(contacts.map(contact =>
            contact.id === editingContact.id ? updatedContact : contact
          ));
          toast({
            title: 'Kişi güncellendi',
            status: 'success',
            duration: 2000,
            isClosable: true,
          });
        } else {
          throw new Error('Kişi güncellenirken bir hata oluştu');
        }
      } else {
        const res = await fetch('http://localhost:8000/api/v1/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newContact),
          credentials: 'include',
        });

        if (res.ok) {
          const createdContact = await res.json();
          setContacts([...contacts, createdContact]);
          toast({
            title: 'Kişi eklendi',
            status: 'success',
            duration: 2000,
            isClosable: true,
          });
        } else {
          throw new Error('Kişi eklenirken bir hata oluştu');
        }
      }
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

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.first_name.toLowerCase().includes(searchText.toLowerCase()) ||
      contact.last_name.toLowerCase().includes(searchText.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchText.toLowerCase()) ||
      contact.last_name.toLowerCase().includes(searchText.toLowerCase()) ||
      contact.phone.toLowerCase().includes(searchText.toLowerCase())
  );

  // Pagination için hesaplamalar
  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = filteredContacts.slice(indexOfFirstContact, indexOfLastContact);
  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <HStack justifyContent="space-between">
          <Input
            placeholder="Ara..."
            onChange={(e) => setSearchText(e.target.value)}
            width="300px"
          />
          <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={handleAdd}>
            Kişi Ekle
          </Button>
        </HStack>

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Ad</Th>
              <Th>E-posta</Th>
              <Th>Telefon</Th>
              <Th>İşlemler</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentContacts.map((contact) => (
              <Tr key={contact.id}>
                <Td>{contact.first_name} {contact.last_name}</Td>
                <Td>{contact.email}</Td>
                <Td>{contact.phone}</Td>
                <Td>
                  <Button leftIcon={<EditIcon />} mr={2} onClick={() => handleEdit(contact)}>
                    Düzenle
                  </Button>
                  <Button leftIcon={<DeleteIcon />} colorScheme="red" onClick={() => handleDeleteClick(contact.id)}>
                    Sil
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {/* Pagination */}
        <HStack justifyContent="center" mt={4}>
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
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader>{editingContact ? 'Kişiyi Düzenle' : 'Yeni Kişi Ekle'}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Ad</FormLabel>
                  <Input name="name" defaultValue={editingContact?.first_name} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Soyad</FormLabel>
                  <Input name="surname" defaultValue={editingContact?.last_name} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>E-posta</FormLabel>
                  <Input name="email" type="email" defaultValue={editingContact?.email} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Telefon</FormLabel>
                  <Input name="phone" defaultValue={editingContact?.phone} />
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
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Kişiyi Sil
            </AlertDialogHeader>

            <AlertDialogBody>
              Bu işlem geri alınamaz. Kişiyi sildiğinizde, bu kişiyle ilişkili tüm anlaşmalar ve biletler de silinecektir. Devam etmek istiyor musunuz?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onAlertClose}>
                İptal
              </Button>
              <Button colorScheme="red" onClick={handleDeleteConfirm} ml={3}>
                Sil
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}