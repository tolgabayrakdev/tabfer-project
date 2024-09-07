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
  FormErrorMessage,
} from '@chakra-ui/react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [user, setUser] = useState({
    username: 'johndoe', // 'name' yerine 'username' kullanıyoruz
    email: 'john@example.com',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const toast = useToast();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

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

  const validatePasswordChange = () => {
    let isValid = true;
    const newErrors = {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    };

    if (!user.currentPassword) {
      newErrors.currentPassword = 'Mevcut şifre gereklidir';
      isValid = false;
    }

    if (!user.newPassword) {
      newErrors.newPassword = 'Yeni şifre gereklidir';
      isValid = false;
    } else if (user.newPassword.length < 6) {
      newErrors.newPassword = 'Yeni şifre en az 6 karakterli olmalıdır';
      isValid = false;
    }

    if (!user.confirmNewPassword) {
      newErrors.confirmNewPassword = 'Şifre onayı gereklidir';
      isValid = false;
    }

    if (user.newPassword !== user.confirmNewPassword) {
      newErrors.confirmNewPassword = 'Şifreler eşleşmiyor';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChangePassword = () => {
    if (validatePasswordChange()) {
      // Burada şifre değiştirme API çağrısı yapılabilir
      toast({
        title: 'Şifre değiştirildi.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setUser({ ...user, currentPassword: '', newPassword: '', confirmNewPassword: '' });
    }
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
                <FormLabel>Kullanıcı Adı</FormLabel>
                <Input
                  value={user.username}
                  onChange={(e) => setUser({ ...user, username: e.target.value })}
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
              <FormControl isInvalid={!!errors.currentPassword}>
                <FormLabel>Mevcut Şifre</FormLabel>
                <Input
                  type="password"
                  value={user.currentPassword}
                  onChange={(e) => setUser({ ...user, currentPassword: e.target.value })}
                />
                <FormErrorMessage>{errors.currentPassword}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.newPassword}>
                <FormLabel>Yeni Şifre</FormLabel>
                <Input
                  type="password"
                  value={user.newPassword}
                  onChange={(e) => setUser({ ...user, newPassword: e.target.value })}
                />
                <FormErrorMessage>{errors.newPassword}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.confirmNewPassword}>
                <FormLabel>Yeni Şifre (Tekrar)</FormLabel>
                <Input
                  type="password"
                  value={user.confirmNewPassword}
                  onChange={(e) => setUser({ ...user, confirmNewPassword: e.target.value })}
                />
                <FormErrorMessage>{errors.confirmNewPassword}</FormErrorMessage>
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