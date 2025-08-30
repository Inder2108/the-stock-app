import { Button, Table, Text } from "@chakra-ui/react";
import React, { useContext } from "react";
import { AppContext } from "../../AppContext";
import EMAIndicator from "../EMAIndicator/EMAIndicator";

const numberRender = (num, isNonCurrency, isPercent) => {
    const returnNum = isNonCurrency ? (num ? num.toFixed(2) : "") : (num ? num.toLocaleString('en-IN', {
        maximumFractionDigits: 2,
        style: 'currency',
        currency: 'INR'
    }) : "");
    return isPercent ? returnNum + " %" : returnNum;
}

const StockTable = ({ }) => {
    const { rows = [] } = useContext(AppContext);

    const onAdd = () => {

    };

    const onRemove = () => {

    };

    return <Table.Root
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
                    PE
                </Table.ColumnHeader>
                <Table.ColumnHeader color="gray.100" fontWeight="semibold">
                    Weightage
                </Table.ColumnHeader>
                <Table.ColumnHeader color="gray.100" fontWeight="semibold">
                    Current Weightage
                </Table.ColumnHeader>
                <Table.ColumnHeader color="gray.100" fontWeight="semibold">
                    Invested
                </Table.ColumnHeader>
                <Table.ColumnHeader color="gray.100" fontWeight="semibold">
                    Profit/Loss
                </Table.ColumnHeader>
                <Table.ColumnHeader color="gray.100" fontWeight="semibold">
                    Profit/Loss(%)
                </Table.ColumnHeader>
                <Table.ColumnHeader color="gray.100" fontWeight="semibold">
                    EMA Indicators
                </Table.ColumnHeader>
                <Table.ColumnHeader color="gray.100" fontWeight="semibold">
                    Actions
                </Table.ColumnHeader>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {(rows || []).length === 0 ? (
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
                (rows || []).map((row, idx) => (
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
                        <Table.Cell color="gray.200">
                            {numberRender(row.pe_ratio, true)}
                        </Table.Cell>
                        <Table.Cell color="gray.200">
                            {numberRender(row.weightage, true, true)}
                        </Table.Cell>
                        <Table.Cell color="gray.200">
                            {numberRender(row.current_weightage, true, true)}
                        </Table.Cell>
                        <Table.Cell color="gray.300">
                            {numberRender(row.invested)}
                        </Table.Cell>
                        <Table.Cell color={row.profit_loss && row.profit_loss > 0 ? "green.400" : "red.400"}>
                            {numberRender(row.profit_loss)}
                        </Table.Cell>
                        <Table.Cell color={row.profit_loss && row.profit_loss > 0 ? "green.400" : "red.400"}>
                            {numberRender(row.profit_loss_percent, true, true)}
                        </Table.Cell>
                        <Table.Cell color="gray.300">
                            {!row.isLastRow && <EMAIndicator ema10={row.ema_10w} ema20={row.ema_20w} ema40={row.ema_40w} currentPrice={row.current_price} />}
                        </Table.Cell>
                        <Table.Cell color="gray.200">
                            {!row.isLastRow && <div><i onCLick={() => {

                            }} class="bi bi-plus-circle" style={{ color: "green", cursor: "pointer", fontSize: "1.5rem" }}></i>
                                <i onCLick={() => {

                                }} class="bi bi-dash-circle" style={{ color: "gray", cursor: "pointer", fontSize: "1.5rem", paddingLeft: "5px" }}></i>
                                <i onCLick={() => {

                                }} class="bi bi-x-circle" style={{ color: "red", cursor: "pointer", fontSize: "1.5rem", paddingLeft: "5px" }}></i></div>
                            }
                        </Table.Cell>
                    </Table.Row>
                ))
            )}
        </Table.Body>
    </Table.Root>
};

export default StockTable;

