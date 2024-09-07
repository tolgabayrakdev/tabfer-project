import React, { useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  HStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const toast = useToast();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Burada kullanıcı bilgilerini güncelleme API çağrısı yapılabilir
    setIsEditing(false);
    toast({
      title: 'Profil güncellendi.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleDelete = () => {
    // Burada hesap silme API çağrısı yapılabilir
    setIsDeleteDialogOpen(false);
    toast({
      title: 'Hesap silindi.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
    // Kullanıcıyı ana sayfaya yönlendir
  };

  const handleChangePassword = () => {
    // Burada şifre değiştirme API çağrısı yapılabilir
    if (user.newPassword !== user.confirmNewPassword) {
      toast({
        title: 'Şifreler eşleşmiyor.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    toast({
      title: 'Şifre değiştirildi.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    setUser({ ...user, currentPassword: '', newPassword: '', confirmNewPassword: '' });
  };

  return (
    <Box>
      <Heading size="lg" mb={6}>Profil</Heading>
      <Tabs>
        <TabList>
          <Tab>Profil Bilgileri</Tab>
          <Tab>Şifre Değiştir</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Ad Soyad</FormLabel>
                <Input
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  isReadOnly={!isEditing}
                />
              </FormControl>
              <FormControl>
                <FormLabel>E-posta</FormLabel>
                <Input
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  isReadOnly={!isEditing}
                />
              </FormControl>
              <HStack spacing={4}>
                {isEditing ? (
                  <Button size="sm" colorScheme="blue" onClick={handleSave}>Kaydet</Button>
                ) : (
                  <Button size="sm" onClick={handleEdit}>Düzenle</Button>
                )}
                <Button size="sm" colorScheme="red" onClick={() => setIsDeleteDialogOpen(true)}>
                  Hesabı Sil
                </Button>
              </HStack>
            </VStack>
          </TabPanel>
          <TabPanel>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Mevcut Şifre</FormLabel>
                <Input
                  type="password"
                  value={user.currentPassword}
                  onChange={(e) => setUser({ ...user, currentPassword: e.target.value })}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Yeni Şifre</FormLabel>
                <Input
                  type="password"
                  value={user.newPassword}
                  onChange={(e) => setUser({ ...user, newPassword: e.target.value })}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Yeni Şifre (Tekrar)</FormLabel>
                <Input
                  type="password"
                  value={user.confirmNewPassword}
                  onChange={(e) => setUser({ ...user, confirmNewPassword: e.target.value })}
                />
              </FormControl>
              <Button 
                size="sm" 
                colorScheme="green" 
                onClick={handleChangePassword}
                width="150px" // Burada genişliği sınırladık
              >
                Şifreyi Değiştir
              </Button>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <AlertDialog
        isOpen={isDeleteDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Hesabı Sil
            </AlertDialogHeader>

            <AlertDialogBody>
              Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDeleteDialogOpen(false)}>
                İptal
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Sil
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default Profile;