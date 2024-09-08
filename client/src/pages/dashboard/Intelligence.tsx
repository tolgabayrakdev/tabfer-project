import { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
} from '@chakra-ui/react';

interface AnalysisResult {
  domain: string;
  ipAddress: string;
  lastAnalysisStats: {
    harmless: number;
    malicious: number;
    suspicious: number;
    undetected: number;
  };
}

const Intelligence = () => {
  const [url, setUrl] = useState('');
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const toast = useToast();

  const handleAnalyze = async () => {
    if (!url) {
      toast({
        title: "URL gerekli",
        description: "Lütfen analiz etmek için bir URL veya domain girin.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Burada VirusTotal API çağrısı yapılacak
    // Şimdilik örnek bir veri ekliyoruz
    const mockResult: AnalysisResult = {
      domain: url,
      ipAddress: '192.168.1.1', // Örnek IP
      lastAnalysisStats: {
        harmless: 70,
        malicious: 0,
        suspicious: 2,
        undetected: 8,
      },
    };

    setAnalysisResults(prev => [...prev, mockResult]);
    setUrl('');
  };

  return (
    <Box>
      <Heading size="lg" mb={6}>İstihbarat</Heading>
      <Text mb={4}>Bu sayfada VirusTotal kullanılarak URL ve domain analizleri yapılmaktadır.</Text>
      
      <VStack spacing={4} align="stretch" mb={6}>
        <Input 
          placeholder="URL veya domain girin" 
          value={url} 
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button colorScheme="blue" onClick={handleAnalyze}>Analiz Et</Button>
      </VStack>

      <Card>
        <CardHeader>
          <Heading size="md">VirusTotal Analiz Sonuçları</Heading>
        </CardHeader>
        <CardBody>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Domain</Th>
                <Th>IP Adresi</Th>
                <Th>Zararsız</Th>
                <Th>Kötü Amaçlı</Th>
                <Th>Şüpheli</Th>
                <Th>Tespit Edilemedi</Th>
              </Tr>
            </Thead>
            <Tbody>
              {analysisResults.map((result, index) => (
                <Tr key={index}>
                  <Td>{result.domain}</Td>
                  <Td>{result.ipAddress}</Td>
                  <Td>{result.lastAnalysisStats.harmless}</Td>
                  <Td>{result.lastAnalysisStats.malicious}</Td>
                  <Td>{result.lastAnalysisStats.suspicious}</Td>
                  <Td>{result.lastAnalysisStats.undetected}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>
    </Box>
  );
};

export default Intelligence;