import React, { useState, useEffect } from 'react';
import {
  Box, Button, Input, Table, Thead, Tbody, Tr, Th, Td,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  FormControl, FormLabel, Select, useDisclosure, VStack, HStack, useToast,
  NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon, DownloadIcon } from '@chakra-ui/icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

type Contact = {
  id: string;
  name: string;
};

type Deal = {
  id: string;
  title: string;
  amount: number;
  status: string;
  contactId: string;
};

export default function Deal() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    fetchDeals();
    fetchContacts();
  }, []);

  const fetchDeals = async () => {
    // TODO: API'den deals verilerini çek
    const sampleDeals: Deal[] = [
      { id: '1', title: 'Deal 1', amount: 1000, status: 'Open', contactId: '1' },
      { id: '2', title: 'Deal 2', amount: 2000, status: 'Closed', contactId: '2' },
    ];
    setDeals(sampleDeals);
  };

  const fetchContacts = async () => {
    // TODO: API'den contacts verilerini çek
    const sampleContacts: Contact[] = [
      { id: '1', name: 'John Doe' },
      { id: '2', name: 'Jane Smith' },
    ];
    setContacts(sampleContacts);
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
    // TODO: API'ye silme isteği gönder
    setDeals(deals.filter(deal => deal.id !== id));
    toast({
      title: 'Deal silindi',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newDeal = {
      id: editingDeal?.id || Date.now().toString(),
      title: formData.get('title') as string,
      amount: Number(formData.get('amount')),
      status: formData.get('status') as string,
      contactId: formData.get('contactId') as string,
    };

    if (editingDeal) {
      // TODO: API'ye güncelleme isteği gönder
      setDeals(deals.map(deal => deal.id === editingDeal.id ? newDeal : deal));
      toast({
        title: 'Deal güncellendi',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } else {
      // TODO: API'ye ekleme isteği gönder
      setDeals([...deals, newDeal]);
      toast({
        title: 'Yeni deal eklendi',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }
    onClose();
  };

  const filteredDeals = deals.filter(deal => 
    statusFilter === 'All' ? true : deal.status === statusFilter
  );

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Başlık", "Miktar", "Durum", "İlgili Kişi"];
    const tableRows: any[][] = [];

    filteredDeals.forEach(deal => {
      const dealData = [
        deal.title,
        deal.amount,
        deal.status,
        contacts.find(c => c.id === deal.contactId)?.name || 'Bilinmiyor'
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

  return (
    <Box>
      <HStack justifyContent="space-between" mb={4}>
        <HStack>
          <Button w="xs" leftIcon={<AddIcon />} colorScheme="blue" onClick={handleAdd}>
            Yeni Deal Ekle
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
          {filteredDeals.map((deal) => (
            <Tr key={deal.id}>
              <Td>{deal.title}</Td>
              <Td>{deal.amount}</Td>
              <Td>{deal.status}</Td>
              <Td>{contacts.find(c => c.id === deal.contactId)?.name}</Td>
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
                  <FormLabel>Miktar</FormLabel>
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
                  <Select name="contactId" defaultValue={editingDeal?.contactId}>
                    {contacts.map(contact => (
                      <option key={contact.id} value={contact.id}>{contact.name}</option>
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
    </Box>
  );
}