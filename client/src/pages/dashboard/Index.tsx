import { useEffect, useState } from 'react';
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Helmet } from 'react-helmet-async';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

type Props = {};

export default function Index({ }: Props) {
  const [ticketStats, setTicketStats] = useState({ total: 0, thisMonth: 0 });
  const [dealStats, setDealStats] = useState({ total: 0, thisMonth: 0 });
  const [contactStats, setContactStats] = useState({ total: 0, thisMonth: 0 });

  const bgColor = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.200');

  useEffect(() => {
    // Burada gerçek API çağrıları yapılacak
    // Şimdilik örnek veriler kullanıyoruz
    setTicketStats({ total: 150, thisMonth: 30 });
    setDealStats({ total: 75, thisMonth: 15 });
    setContactStats({ total: 500, thisMonth: 50 });
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Son 6 Ay İstatistikleri',
      },
    },
  };

  const chartData = {
    labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'],
    datasets: [
      {
        label: 'Ticket',
        data: [12, 19, 3, 5, 2, 3],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Deal',
        data: [5, 10, 15, 8, 12, 7],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Contact',
        data: [20, 25, 30, 35, 40, 45],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  const pieChartData = {
    labels: ['Açık Ticket\'lar', 'Kapalı Ticket\'lar'],
    datasets: [
      {
        data: [ticketStats.total - ticketStats.thisMonth, ticketStats.thisMonth],
        backgroundColor: ['rgba(255, 99, 132, 0.8)', 'rgba(53, 162, 235, 0.8)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(53, 162, 235, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Ticket Durumu Dağılımı',
      },
    },
  };

  return (
    <>
      <Helmet>
        <title>
          Dashboard
        </title>
      </Helmet>
      <Box p={5}>
        <Heading as="h1" size="xl" mb={6}>
          Dashboard
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={6}>
          <Stat bg={bgColor} p={5} borderRadius="lg" boxShadow="md">
            <StatLabel color={textColor}>Toplam Ticket</StatLabel>
            <StatNumber>{ticketStats.total}</StatNumber>
            <StatHelpText>Bu ay: +{ticketStats.thisMonth}</StatHelpText>
          </Stat>
          <Stat bg={bgColor} p={5} borderRadius="lg" boxShadow="md">
            <StatLabel color={textColor}>Toplam Deal</StatLabel>
            <StatNumber>{dealStats.total}</StatNumber>
            <StatHelpText>Bu ay: +{dealStats.thisMonth}</StatHelpText>
          </Stat>
          <Stat bg={bgColor} p={5} borderRadius="lg" boxShadow="md">
            <StatLabel color={textColor}>Toplam Contact</StatLabel>
            <StatNumber>{contactStats.total}</StatNumber>
            <StatHelpText>Bu ay: +{contactStats.thisMonth}</StatHelpText>
          </Stat>
        </SimpleGrid>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
          <Box
            bg={bgColor}
            p={5}
            borderRadius="lg"
            boxShadow="md"
            height="400px"
          >
            <Line options={chartOptions} data={chartData} />
          </Box>
          <Box
            bg={bgColor}
            p={5}
            borderRadius="lg"
            boxShadow="md"
            height="400px"
          >
            <Pie options={pieChartOptions} data={pieChartData} />
          </Box>
        </SimpleGrid>
      </Box>
    </>

  );
}