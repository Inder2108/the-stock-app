import { Button, Drawer, Field, Flex, Input, VStack } from "@chakra-ui/react";
import React, { useContext } from "react";
import { AppContext } from "../../AppContext";
import axios from "axios";

const StockAddEditForm = () => {
    const { isOpen, isEdit, form, setForm, setIsOpen } = useContext(AppContext);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleClose = () => {
        setForm({ ticker: '', qty: '', avgPrice: '' });
        setIsOpen(false)
    };

    const handleSave = async () => {
        if (!form.ticker || !form.qty || !form.avgPrice) {
            return;
        }

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
        }
    };

    return <Drawer.Root
        open={isOpen}
        onOpenChange={(open) => setIsOpen(open)}
    >
        <Drawer.Backdrop bg="blackAlpha.600" />
        <Drawer.Content bg="gray.800" color="white">
            <Drawer.Header>
                <Drawer.Title color="white" fontSize="xl">
                    {isEdit ? "Edit Stock" : "Add Stock"}
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
                            disabled={isEdit}
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
    </Drawer.Root >
};

export default StockAddEditForm;

