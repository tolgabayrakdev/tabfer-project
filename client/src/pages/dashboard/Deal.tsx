import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box, Button, Input, Table, Thead, Tbody, Tr, Th, Td,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  FormControl, FormLabel, Select, useDisclosure, VStack, HStack, useToast,
  NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper,
  Text, Spinner, Badge, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon, DownloadIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Helmet } from 'react-helmet-async';

type Contact = {
  id: string;
  first_name: string;
  last_name: string;
};

type Deal = {
  id: string;
  title: string;
  amount: number;
  status: string;
  contact_id: string;
};

export default function Deal() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [dealsPerPage] = useState(8);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState<{ isOpen: boolean; dealId: string | null }>({ isOpen: false, dealId: null });
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [allDeals, setAllDeals] = useState<Deal[]>([]);
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>([]);
  const [isContactsLoading, setIsContactsLoading] = useState(true);

  const fetchDeals = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/deal', {
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Deals fetching failed');
      const data = await res.json();
      setAllDeals(data);
      setFilteredDeals(data);
    } catch (error) {
      console.error('Error fetching deals:', error);
      toast({
        title: 'Error fetching deals',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchDeals();
    fetchContacts();
  }, [fetchDeals]);

  useEffect(() => {
    const filtered = allDeals.filter(deal =>
      statusFilter === 'All' ? true : deal.status === statusFilter
    );
    setFilteredDeals(filtered);
    setCurrentPage(1); // Reset to first page when filter changes
  }, [statusFilter, allDeals]);

  // Pagination için hesaplamalar
  const indexOfLastDeal = currentPage * dealsPerPage;
  const indexOfFirstDeal = indexOfLastDeal - dealsPerPage;
  const currentDeals = filteredDeals.slice(indexOfFirstDeal, indexOfLastDeal);
  const totalPages = Math.ceil(filteredDeals.length / dealsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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

  const handleAdd = () => {
    setEditingDeal(null);
    onOpen();
  };

  const handleEdit = (deal: Deal) => {
    setEditingDeal(deal);
    onOpen();
  };

  const handleDelete = async (id: string) => {
    setDeleteAlert({ isOpen: true, dealId: id });
  };

  const confirmDelete = async () => {
    if (deleteAlert.dealId) {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/deal/${deleteAlert.dealId}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (!res.ok) throw new Error('Deal deletion failed');

        // Deals'i yeniden çek
        await fetchDeals();

        toast({
          title: 'Anlaşma silindi',
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
    setDeleteAlert({ isOpen: false, dealId: null });
  };

  const cancelDelete = () => {
    setDeleteAlert({ isOpen: false, dealId: null });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newDeal = {
      title: formData.get('title') as string,
      amount: Number(formData.get('amount')),
      status: formData.get('status') as string,
      contact_id: formData.get('contactId') as string,
    };

    try {
      const url = editingDeal
        ? `http://localhost:8000/api/v1/deal/${editingDeal.id}`
        : 'http://localhost:8000/api/v1/deal';
      const method = editingDeal ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDeal),
        credentials: 'include',
      });

      if (!res.ok) throw new Error(editingDeal ? 'Anlaşma bilgileri guncellenemedi' : 'Yeni anlaşma eklenemedi');

      // Deals'i yeniden çek
      await fetchDeals();

      toast({
        title: editingDeal ? 'Anlaşma güncellendi' : 'Yeni anlaşma eklendi',
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

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Baslik", "Miktar", "Durum", "Ilgili Kisi"];
    const tableRows: any[][] = [];

    filteredDeals.forEach(deal => {
      const dealData = [
        deal.title,
        deal.amount,
        deal.status,
        contacts.find(c => c.id === deal.contact_id)?.first_name + ' ' + contacts.find(c => c.id === deal.contact_id)?.last_name || 'Bilinmiyor'
      ];
      tableRows.push(dealData);
    });

    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
    });

    doc.save(`deals_${statusFilter.toLowerCase()}.pdf`);

    toast({
      title: 'PDF başarıyla oluşturuldu',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'green';
      case 'Closed':
        return 'red';
      case 'Pending':
        return 'orange';
      default:
        return 'gray';
    }
  };

  return (
    <>
      <Helmet>
        <title>Deals - Dashboard</title>
      </Helmet>
      <Box>
        <HStack justifyContent="space-between" mb={4}>
          <HStack>
            <Button w="xs" leftIcon={<AddIcon />} colorScheme="blue" onClick={handleAdd}>
              Yeni Anlaşma Ekle
            </Button>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">Tüm Durumlar</option>
              <option value="Open">Açık</option>
              <option value="Closed">Kapalı</option>
              <option value="Pending">Beklemede</option>
            </Select>
          </HStack>
          <Button leftIcon={<DownloadIcon />} colorScheme="green" onClick={exportToPDF}>
            PDF Olarak İndir
          </Button>
        </HStack>

        {isLoading || isContactsLoading ? (
          <Box textAlign="center" py={10}>
            <Spinner size="xl" />
            <Text mt={4}>Yükleniyor...</Text>
          </Box>
        ) : (
          <>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Başlık</Th>
                  <Th>Miktar</Th>
                  <Th>Durum</Th>
                  <Th>İlgili Kişi</Th>
                  <Th>İşlemler</Th>
                </Tr>
              </Thead>
              <Tbody>
                {currentDeals.map((deal) => (
                  <Tr key={deal.id}>
                    <Td>{deal.title}</Td>
                    <Td>{deal.amount}₺</Td>
                    <Td>
                      <Badge colorScheme={getStatusColor(deal.status)}>
                        {deal.status}
                      </Badge>
                    </Td>
                    <Td>{contacts.find(c => c.id === deal.contact_id)?.first_name + ' ' + contacts.find(c => c.id === deal.contact_id)?.last_name || 'Bilinmiyor'}</Td>
                    <Td>
                      <Button leftIcon={<EditIcon />} mr={2} onClick={() => handleEdit(deal)}>
                        Düzenle
                      </Button>
                      <Button leftIcon={<DeleteIcon />} colorScheme="red" onClick={() => handleDelete(deal.id)}>
                        Sil
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>

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
          </>
        )}

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <form onSubmit={handleSubmit}>
              <ModalHeader>{editingDeal ? 'Deal Düzenle' : 'Yeni Deal Ekle'}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Başlık</FormLabel>
                    <Input name="title" defaultValue={editingDeal?.title} />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Miktar ₺</FormLabel>
                    <NumberInput min={0} defaultValue={editingDeal?.amount || 0}>
                      <NumberInputField name="amount" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Durum</FormLabel>
                    <Select name="status" defaultValue={editingDeal?.status || 'Open'}>
                      <option value="Open">Açık</option>
                      <option value="Closed">Kapalı</option>
                      <option value="Pending">Beklemede</option>
                    </Select>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>İlgili Kişi</FormLabel>
                    <Select name="contactId" defaultValue={editingDeal?.contact_id}>
                      {contacts.map(contact => (
                        <option key={contact.id} value={contact.id}>{contact.first_name} {contact.last_name}</option>
                      ))}
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
          onClose={cancelDelete}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Anlaşmayı Sil
              </AlertDialogHeader>

              <AlertDialogBody>
                Bu işlem geri alınamaz. Bu anlaşmayı silmek istediğinizden emin misiniz?
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={cancelDelete}>
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