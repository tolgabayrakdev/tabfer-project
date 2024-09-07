import { useState, useCallback, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Box,
  Flex,
  VStack,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Text,
  Button,
  useColorMode,
  Spacer
} from '@chakra-ui/react'
import { HamburgerIcon, ViewIcon, SettingsIcon, InfoIcon, SunIcon, MoonIcon } from '@chakra-ui/icons'
import LoadingSpinner from '../components/Loading'

// NavItem bileşeni
const NavItem = ({ icon, children, to, onClick }: { icon: React.ReactNode, children: React.ReactNode, to: string, onClick: (to: string) => void }) => {
  const location = useLocation()
  const active = location.pathname === to

  return (
    <Button
      leftIcon={icon ? <>{icon}</> : undefined}
      variant={active ? "solid" : "ghost"}
      colorScheme={active ? "blue" : "gray"}
      justifyContent="flex-start"
      width="100%"
      borderRadius="md"
      mb={2}
      onClick={() => onClick(to)}
    >
      {children}
    </Button>
  )
}

// Sidebar bileşeni
const Sidebar = ({ onNavigate }: { onNavigate: (to: string) => void }) => {
  return (
    <VStack align="stretch" spacing={4} p={4}>
      <NavItem icon={<ViewIcon />} to="/dashboard" onClick={onNavigate}>
        Dashboard
      </NavItem>
      <NavItem icon={<SettingsIcon />} to="/dashboard/settings" onClick={onNavigate}>
        Ayarlar
      </NavItem>
      <NavItem icon={<InfoIcon />} to="/dashboard/about" onClick={onNavigate}>
        Hakkında
      </NavItem>
    </VStack>
  )
}

export default function DashboardLayout() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { colorMode, toggleColorMode } = useColorMode()
  const navigate = useNavigate()
  const location = useLocation()
  const [isLogoutLoading, setIsLogoutLoading] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(false)

  const handleNavigation = useCallback((to: string) => {
    setIsPageLoading(true)
    setTimeout(() => {
      navigate(to)
    }, 1000) // 1.5 saniye bekletme
  }, [navigate])

  useEffect(() => {
    setIsPageLoading(false)
  }, [location])

  const handleLogout = useCallback(() => {
    setIsLogoutLoading(true)
    setTimeout(() => {
      // Burada çıkış işlemlerini gerçekleştirin
      navigate('/login') // Kullanıcıyı login sayfasına yönlendir
      setIsLogoutLoading(false)
    }, 1000) // 1.5 saniye bekletme
  }, [navigate])

  return (
    <Flex minH="100vh">
      {/* Desktop için sabit Sidebar */}
      <Box
        width="250px"
        bg={colorMode === 'light' ? 'gray.50' : 'gray.900'}
        height="100vh"
        position="fixed"
        left={0}
        top={0}
        display={{ base: 'none', md: 'flex' }}
        flexDirection="column"
        borderRightWidth="1px"
        borderRightColor="gray.200"
      >
        <Box p={4} display="flex" justifyContent="center" alignItems="center">
          <Text fontSize="2xl" fontWeight="bold">Dashboard</Text>
        </Box>
        <Box flex={1} overflowY="auto">
          <Sidebar onNavigate={handleNavigation} />
        </Box>
      </Box>

      {/* Ana içerik alanı */}
      <Flex flexDirection="column" flex={1} ml={{ base: 0, md: '250px' }}>
        <Flex
          bg={colorMode === 'light' ? 'white' : 'gray.800'}
          p={4}
          borderBottomWidth="1px"
          borderBottomColor="gray.200"
          alignItems="center"
        >
          <IconButton
            icon={<HamburgerIcon />}
            onClick={onOpen}
            display={{ base: 'flex', md: 'none' }}
            aria-label="Open menu"
          />
          <Spacer />
          <IconButton
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            aria-label="Toggle color mode"
            mr={2}
          />
          <Button
            colorScheme="red"
            onClick={handleLogout}
            isLoading={isLogoutLoading}
            loadingText="Çıkış yapılıyor..."
          >
            Çıkış Yap
          </Button>
        </Flex>

        <Box flex={1} p={4} overflowY="auto" position="relative">
          {isPageLoading && (
            <Box position="absolute" top={0} left={0} right={0} bottom={0} bg="rgba(255,255,255,0.7)" zIndex={1000}>
              <LoadingSpinner />
            </Box>
          )}
          <Outlet />
        </Box>

        {/* Footer */}
        <Box as="footer" bg={colorMode === 'light' ? 'gray.100' : 'gray.700'} p={4} textAlign="center" borderTopWidth="1px" borderTopColor="gray.200">
          <Text>&copy; 2023 Dashboard Örneği</Text>
        </Box>
      </Flex>

      {/* Mobil için Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Dashboard Menü</DrawerHeader>
          <DrawerBody>
            <Sidebar onNavigate={handleNavigation} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  )
}