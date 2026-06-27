"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type PaymentMethod = "bank" | "crypto";

type InvoiceItem = {
  description: string;
  amount: number;
};

const totalAed = 85115;
const exchangeRate = 3.66;
const iban = "AE100030011805839920001";
const walletAddress = "TPZSgfU6GQgMjSUbJePsPePmhLPZbDfXe2";

const payrollItems: InvoiceItem[] = [
  { description: "Арам Халикян", amount: 5000 },
  { description: "Злата Чернядева", amount: 5000 },
  { description: "Арсен Багдасарян", amount: 15000 },
  { description: "Арам Баклачян", amount: 15000 },
  { description: "Гульмира Бибулатова", amount: 35000 },
];

const expenseItems: InvoiceItem[] = [
  { description: "Домен armvazo.com", amount: 250 },
  { description: "Оплата услуг ConsultX - April, May, June", amount: 7320 },
  {
    description:
      "Оплата Минтруда по изменению зарплат Арама Халикяна и Златы Чернядевой",
    amount: 965,
  },
  { description: "Налоговая декларация - Corporate Tax", amount: 1580 },
];

const formatAed = (amount: number) =>
  new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  }).format(amount);

const formatUsdt = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

export default function InvoicePage() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bank");
  const cryptoAmount = useMemo(() => totalAed / exchangeRate, []);
  const currentDate = useMemo(
    () =>
      new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date()),
    []
  );

  return (
    <main className="invoice-page">
      <header className="site-header">
        <div className="brand">
          <Image
            src="/consultx-logo.png"
            alt="ConsultX Corporate Solutions"
            width={260}
            height={80}
            className="brand-logo"
            priority
          />
          <span>Boutique Corporate Solutions</span>
        </div>
        <div className="header-meta">
          <span>Invoice</span>
          <strong>Payment Pending</strong>
        </div>
      </header>

      <section className="invoice-shell" aria-label="Invoice payment request">
        <div className="invoice-card">
          <div className="invoice-hero">
            <div>
              <p className="eyebrow">ConsultX Corporate Solutions</p>
              <h1>Invoice / Payment Request</h1>
              <dl className="client-meta">
                <div>
                  <dt>Client</dt>
                  <dd>Armvazo Management Consultancies LLC</dd>
                </div>
                <div>
                  <dt>Date</dt>
                  <dd>{currentDate}</dd>
                </div>
              </dl>
            </div>
            <div className="status-card">
              <span>Status</span>
              <strong>Payment Pending</strong>
              <p>Total Payable</p>
              <b>{formatAed(totalAed)}</b>
            </div>
          </div>

          <InvoiceTable />

          <section className="payment-section" aria-labelledby="payment-heading">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Payment Method</p>
                <h2 id="payment-heading">Select preferred payment option</h2>
              </div>
              <div className="payable-pill">
                {paymentMethod === "bank" ? (
                  <>
                    <span>AED Total</span>
                    <strong>{formatAed(totalAed)}</strong>
                  </>
                ) : (
                  <>
                    <span>Amount to Pay</span>
                    <strong>USDT {formatUsdt(cryptoAmount)}</strong>
                  </>
                )}
              </div>
            </div>

            <PaymentMethodSelector
              value={paymentMethod}
              onChange={setPaymentMethod}
            />

            {paymentMethod === "bank" ? (
              <BankDetails />
            ) : (
              <CryptoDetails cryptoAmount={cryptoAmount} />
            )}
          </section>
        </div>
      </section>

      <footer className="footer">
        <strong>ConsultX Corporate Solutions</strong>
        <p>
          Structured business support, operational clarity, and corporate
          coordination.
        </p>
        <a href="mailto:info@consultx.ae">info@consultx.ae</a>
      </footer>
    </main>
  );
}

function InvoiceTable() {
  const payrollSubtotal = payrollItems.reduce((sum, item) => sum + item.amount, 0);
  const expensesSubtotal = expenseItems.reduce((sum, item) => sum + item.amount, 0);

  return (
    <section className="invoice-table-section" aria-labelledby="invoice-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Invoice Details</p>
          <h2 id="invoice-heading">Items and totals</h2>
        </div>
      </div>

      <div className="invoice-table" role="table" aria-label="Invoice items">
        <div className="table-head" role="row">
          <span role="columnheader">Description</span>
          <span role="columnheader">Amount</span>
        </div>
        <InvoiceGroup title="Зарплатный фонд" items={payrollItems} />
        <SubtotalRow label="Subtotal Payroll" amount={payrollSubtotal} />
        <InvoiceGroup title="Расходы" items={expenseItems} />
        <SubtotalRow label="Subtotal Expenses" amount={expensesSubtotal} />
        <div className="total-row" role="row">
          <span role="cell">Total Payable</span>
          <strong role="cell">{formatAed(totalAed)}</strong>
        </div>
      </div>
    </section>
  );
}

function InvoiceGroup({ title, items }: { title: string; items: InvoiceItem[] }) {
  return (
    <>
      <div className="group-row" role="row">
        <strong role="cell">{title}</strong>
        <span role="cell" />
      </div>
      {items.map((item) => (
        <div className="item-row" role="row" key={item.description}>
          <span role="cell">{item.description}</span>
          <strong role="cell">{formatAed(item.amount)}</strong>
        </div>
      ))}
    </>
  );
}

function SubtotalRow({ label, amount }: { label: string; amount: number }) {
  return (
    <div className="subtotal-row" role="row">
      <span role="cell">{label}</span>
      <strong role="cell">{formatAed(amount)}</strong>
    </div>
  );
}

function PaymentMethodSelector({
  value,
  onChange,
}: {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
}) {
  return (
    <div className="segmented-control" role="tablist" aria-label="Payment method">
      <button
        type="button"
        role="tab"
        aria-selected={value === "bank"}
        className={value === "bank" ? "active" : ""}
        onClick={() => onChange("bank")}
      >
        AED Bank Transfer
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={value === "crypto"}
        className={value === "crypto" ? "active" : ""}
        onClick={() => onChange("crypto")}
      >
        Cryptocurrency
      </button>
    </div>
  );
}

function BankDetails() {
  return (
    <div className="payment-card">
      <div className="details-grid">
        <Detail label="Bank" value="ADCB - Abu Dhabi Commercial Bank" />
        <Detail label="Account Name" value="Marat Ohanyan" />
        <Detail label="Account Number" value="11805839920001" />
        <Detail label="Currency" value="AED" />
      </div>
      <div className="copy-panel">
        <div>
          <span>IBAN</span>
          <strong>{iban}</strong>
        </div>
        <CopyButton value={iban} label="Copy IBAN" />
      </div>
    </div>
  );
}

function CryptoDetails({ cryptoAmount }: { cryptoAmount: number }) {
  return (
    <div className="payment-card crypto-card">
      <div className="crypto-layout">
        <div className="qr-frame">
          <Image
            src="/crypto-qr.jpeg"
            alt="TRC20 wallet QR code"
            width={220}
            height={220}
            className="qr-image"
          />
        </div>
        <div className="crypto-content">
          <div className="crypto-total">
            <span>Amount to Pay</span>
            <strong>USDT {formatUsdt(cryptoAmount)}</strong>
          </div>
          <div className="details-grid">
            <Detail label="Total Payable in AED" value={formatAed(totalAed)} />
            <Detail label="Network" value="TRC20" />
            <Detail label="Exchange Rate" value="1 USDT = AED 3.66" />
          </div>
          <div className="copy-panel">
            <div>
              <span>Wallet Address</span>
              <strong>{walletAddress}</strong>
            </div>
            <CopyButton value={walletAddress} label="Copy Wallet Address" />
          </div>
          <p className="warning">
            Please ensure that the transfer is made strictly via TRC20 network.
            Transfers through other networks may not be recoverable.
          </p>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="detail">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function copyValue() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="copy-action">
      <button type="button" onClick={copyValue}>
        {label}
      </button>
      <span aria-live="polite">{copied ? "Copied" : ""}</span>
    </div>
  );
}
