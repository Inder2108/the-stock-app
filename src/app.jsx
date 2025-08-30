import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from './AppContext';
import {
  ChakraProvider,
  Box,
  Button,
  Table,
  Drawer,
  Input,
  Field,
  Flex,
  VStack,
  Text,
  createSystem,
  defaultConfig
} from "@chakra-ui/react";
import axios from 'axios';
import StockAddEditForm from './components/StockAddEditForm';
import StockTable from './components/StockTable';

// Create system for Chakra v3 with dark theme configuration
const system = createSystem(defaultConfig, {
  theme: {
    config: {
      initialColorMode: 'dark',
      useSystemColorMode: false,
    }
  }
});

function App() {
  const { rows, form, loading, isOpen, setRows, setForm, setLoading, setIsOpen } = useContext(AppContext);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  // Load initial data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/stocks');
        let sum = 0;
        res.data.map(stock => stock.avg_price * stock.qty).forEach(invested => {
          sum += invested;
        });

        let overallProfitLoss = 0;
        let overallInvested = 0;

        res.data.forEach(stock => {
          const invested = stock.avg_price * stock.qty;
          stock.invested = invested;
          stock.weightage = ((invested) / sum) * 100;
          stock.current_weightage = ((stock.current_price * stock.qty) / sum) * 100;
          stock.profit_loss = (stock.current_price - stock.avg_price) * stock.qty;
          overallProfitLoss += stock.profit_loss;
          overallInvested += invested;
        });

        res.data.forEach(stock => {
          stock.profit_loss_percent = (stock.profit_loss / (stock.avg_price * stock.qty)) * 100;
        });

        // Last row with combined stats
        res.data.push({
          isLastRow: true,
          ticker: "Total",
          current_price: overallInvested,
          profit_loss: overallProfitLoss,
          profit_loss_percent: (overallProfitLoss / overallInvested) * 100
        })

        setRows(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <ChakraProvider value={system}>
      <Box
        minH="100vh"
        bg="gray.900"
        p={6}
      >
        {/* Top section with Add button */}
        <Flex justify="space-between" align="center" mb={6}>
          <Text fontSize="2xl" fontWeight="bold" color="white">
            Stock Portfolio
          </Text>
          <Button
            colorScheme="blue"
            onClick={onOpen}
            bg="blue.600"
            _hover={{ bg: "blue.500" }}
            color="white"
          >
            Add Stock
          </Button>
        </Flex>
        <StockTable />
        <StockAddEditForm />
      </Box>
    </ChakraProvider>
  );
}

export default App;