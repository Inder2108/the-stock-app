import React, { useState, useEffect } from 'react';
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

// Create system for Chakra v3 with dark theme configuration
const system = createSystem(defaultConfig, {
  theme: {
    config: {
      initialColorMode: 'dark',
      useSystemColorMode: false,
    }
  }
});

const numberRender = (num, isNonCurrency, isPercent) => {
  const returnNum = isNonCurrency ? (num ? num.toFixed(2) : "") : (num ? num.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    style: 'currency',
    currency: 'INR'
  }) : "");
  return isPercent ? returnNum + " %" : returnNum;
}

function App() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ ticker: '', qty: '', avgPrice: '' });
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
          stock.weightage = ((stock.avg_price * stock.qty) / sum) * 100;
          stock.current_weightage = ((stock.current_price * stock.qty) / sum) * 100;
          stock.profit_loss = (stock.current_price - stock.avg_price) * stock.qty;
          overallProfitLoss += stock.profit_loss;
          overallInvested += stock.avg_price * stock.qty;
        });

        res.data.forEach(stock => {
          stock.profit_loss_percent = (stock.profit_loss / (stock.avg_price * stock.qty)) * 100;
        });

        // Last row with combined stats
        res.data.push({
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

  const handleSave = async () => {
    if (!form.ticker || !form.qty || !form.avgPrice) {
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ticker: form.ticker.toUpperCase(),
        qty: Number(form.qty),
        avg_price: Number(form.avgPrice),
      };

      const res = await axios.post('http://localhost:5000/add-stock', payload);
      setRows([...rows, res.data.item]);
      setForm({ ticker: '', qty: '', avgPrice: '' });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm({ ticker: '', qty: '', avgPrice: '' });
    onClose();
  };

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

        {/* Main table container */}
        <Table.Root
          size="lg"
          variant="outline"
          colorScheme="gray"
        >
          <Table.Header bg="gray.700">
            <Table.Row>
              <Table.ColumnHeader color="gray.100" fontWeight="semibold">
                Ticker
              </Table.ColumnHeader>
              <Table.ColumnHeader color="gray.100" fontWeight="semibold">
                Price
              </Table.ColumnHeader>
              <Table.ColumnHeader color="gray.100" fontWeight="semibold">
                10W EMA
              </Table.ColumnHeader>
              <Table.ColumnHeader color="gray.100" fontWeight="semibold">
                20W EMA
              </Table.ColumnHeader>
              <Table.ColumnHeader color="gray.100" fontWeight="semibold">
                40W EMA
              </Table.ColumnHeader>
              <Table.ColumnHeader color="gray.100" fontWeight="semibold">
                PE
              </Table.ColumnHeader>
              <Table.ColumnHeader color="gray.100" fontWeight="semibold">
                Weightage
              </Table.ColumnHeader>
              <Table.ColumnHeader color="gray.100" fontWeight="semibold">
                Current Weightage
              </Table.ColumnHeader>
              <Table.ColumnHeader color="gray.100" fontWeight="semibold">
                Profit/Loss
              </Table.ColumnHeader>
              <Table.ColumnHeader color="gray.100" fontWeight="semibold">
                Profit/Loss(%)
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rows.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={4}>
                  <Text
                    textAlign="center"
                    color="gray.400"
                    py={8}
                    fontSize="lg"
                  >
                    No stocks added yet. Click "Add Stock" to get started.
                  </Text>
                </Table.Cell>
              </Table.Row>
            ) : (
              rows.map((row, idx) => (
                <Table.Row
                  key={idx}
                  _hover={{ bg: "gray.700" }}
                  borderColor="gray.600"
                  backgroundColor={row.ticker === "Total" ? "blue.950" : ""}
                >
                  <Table.Cell color="blue.300" fontWeight="semibold">
                    {row.ticker}
                  </Table.Cell>
                  <Table.Cell color="gray.300">
                    {numberRender(row.current_price)}
                  </Table.Cell>
                  <Table.Cell color="gray.300">
                    {row.ema_10w}
                  </Table.Cell>
                  <Table.Cell color="gray.300">
                    {row.ema_20w}
                  </Table.Cell>
                  <Table.Cell color="gray.300">
                    {row.ema_40w}
                  </Table.Cell>
                  <Table.Cell color="gray.200">
                    {numberRender(row.pe_ratio, true)}
                  </Table.Cell>
                  <Table.Cell color="gray.200">
                    {numberRender(row.weightage, true, true)}
                  </Table.Cell>
                  <Table.Cell color="gray.200">
                    {numberRender(row.current_weightage, true, true)}
                  </Table.Cell>
                  <Table.Cell color={row.profit_loss && row.profit_loss > 0 ? "green.400" : "red.400"}>
                    {numberRender(row.profit_loss)}
                  </Table.Cell>
                  <Table.Cell color={row.profit_loss && row.profit_loss > 0 ? "green.400" : "red.400"}>
                    {numberRender(row.profit_loss_percent, true, true)}
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>

        {/* Drawer for adding new stock */}
        <Drawer.Root
          open={isOpen}
          onOpenChange={(open) => setIsOpen(open)}
          placement="right"
        >
          <Drawer.Backdrop bg="blackAlpha.600" />
          <Drawer.Content bg="gray.800" color="white">
            <Drawer.Header>
              <Drawer.Title color="white" fontSize="xl">
                Add New Stock
              </Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <VStack spacing={4} align="stretch">
                <Field.Root>
                  <Field.Label color="gray.200">Ticker Symbol</Field.Label>
                  <Input
                    name="ticker"
                    value={form.ticker}
                    onChange={handleChange}
                    placeholder="e.g., RELIANCE"
                    bg="gray.700"
                    border="1px solid"
                    borderColor="gray.600"
                    color="white"
                    _placeholder={{ color: "gray.400" }}
                    _focus={{
                      borderColor: "blue.500",
                      boxShadow: "0 0 0 1px blue.500"
                    }}
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label color="gray.200">Quantity</Field.Label>
                  <Input
                    name="qty"
                    type="number"
                    value={form.qty}
                    onChange={handleChange}
                    placeholder="Number of shares"
                    bg="gray.700"
                    border="1px solid"
                    borderColor="gray.600"
                    color="white"
                    _placeholder={{ color: "gray.400" }}
                    _focus={{
                      borderColor: "blue.500",
                      boxShadow: "0 0 0 1px blue.500"
                    }}
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label color="gray.200">Average Price</Field.Label>
                  <Input
                    name="avgPrice"
                    type="number"
                    step="0.01"
                    value={form.avgPrice}
                    onChange={handleChange}
                    placeholder="Average purchase price"
                    bg="gray.700"
                    border="1px solid"
                    borderColor="gray.600"
                    color="white"
                    _placeholder={{ color: "gray.400" }}
                    _focus={{
                      borderColor: "blue.500",
                      boxShadow: "0 0 0 1px blue.500"
                    }}
                  />
                </Field.Root>
              </VStack>
            </Drawer.Body>
            <Drawer.Footer>
              <Flex gap={3} width="100%">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  flex={1}
                  borderColor="gray.600"
                  color="gray.200"
                  _hover={{
                    bg: "gray.700",
                    borderColor: "gray.500"
                  }}
                >
                  Cancel
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={handleSave}
                  loading={loading}
                  flex={1}
                  bg="blue.600"
                  _hover={{ bg: "blue.500" }}
                  color="white"
                >
                  Save Stock
                </Button>
              </Flex>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Root>
      </Box>
    </ChakraProvider>
  );
}

export default App;