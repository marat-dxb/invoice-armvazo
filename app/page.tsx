"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type PaymentMethod = "bank" | "crypto";

type InvoiceItem = {
  description: string;
  amount: number;
  note?: string;
};

const exchangeRate = 3.66;
const consultxMonthlyUsdt = 2000;
const consultxMonths = 3;
const consultxServicesAed = consultxMonthlyUsdt * consultxMonths * exchangeRate;
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
  {
    description: "Оплата услуг ConsultX - April, May, June",
    amount: consultxServicesAed,
    note: "3 месяца × 2,000 USDT",
  },
  {
    description:
      "Оплата Минтруда по изменению зарплат Арама Халикяна и Златы Чернядевой",
    amount: 965,
  },
  { description: "Налоговая декларация - Corporate Tax", amount: 1580 },
];

const payrollSubtotal = payrollItems.reduce((sum, item) => sum + item.amount, 0);
const expensesSubtotal = expenseItems.reduce((sum, item) => sum + item.amount, 0);
const totalAed = payrollSubtotal + expensesSubtotal;

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
      new Intl.DateTimeFormat("ru-RU", {
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
        </div>
        <div className="header-meta">
          <span>Инвойс</span>
          <strong>Ожидает оплаты</strong>
        </div>
      </header>

      <section className="invoice-shell" aria-label="Инвойс и реквизиты оплаты">
        <div className="invoice-card">
          <div className="invoice-hero">
            <div>
              <p className="eyebrow">ConsultX Corporate Solutions</p>
              <h1>Инвойс / Запрос на оплату</h1>
              <dl className="client-meta">
                <div>
                  <dt>Клиент</dt>
                  <dd>Armvazo Management Consultancies LLC</dd>
                </div>
                <div>
                  <dt>Дата</dt>
                  <dd>{currentDate}</dd>
                </div>
              </dl>
            </div>
            <div className="status-card">
              <span>Статус</span>
              <strong>Ожидает оплаты</strong>
              <p>Итого к оплате</p>
              <b>{formatAed(totalAed)}</b>
            </div>
          </div>

          <InvoiceTable />

          <section className="payment-section" aria-labelledby="payment-heading">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Способ оплаты</p>
                <h2 id="payment-heading">Выберите удобный вариант оплаты</h2>
              </div>
              <div className="payable-pill">
                {paymentMethod === "bank" ? (
                  <>
                    <span>Сумма в AED</span>
                    <strong>{formatAed(totalAed)}</strong>
                  </>
                ) : (
                  <>
                    <span>Сумма к оплате</span>
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
          Структурная бизнес-поддержка, операционная ясность и корпоративная
          координация.
        </p>
        <a href="mailto:info@consultx.ae">info@consultx.ae</a>
      </footer>
    </main>
  );
}

function InvoiceTable() {
  return (
    <section className="invoice-table-section" aria-labelledby="invoice-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Детали инвойса</p>
          <h2 id="invoice-heading">Позиции и итоговые суммы</h2>
        </div>
      </div>

      <div className="invoice-table" role="table" aria-label="Позиции инвойса">
        <div className="table-head" role="row">
          <span role="columnheader">Описание</span>
          <span role="columnheader">Сумма</span>
        </div>
        <InvoiceGroup title="Зарплатный фонд" items={payrollItems} />
        <SubtotalRow label="Итого зарплатный фонд" amount={payrollSubtotal} />
        <InvoiceGroup title="Расходы" items={expenseItems} />
        <SubtotalRow label="Итого расходы" amount={expensesSubtotal} />
        <div className="total-row" role="row">
          <span role="cell">Итого к оплате</span>
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
          <span role="cell">
            {item.description}
            {item.note && <small>{item.note}</small>}
          </span>
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
    <div className="segmented-control" role="tablist" aria-label="Способ оплаты">
      <button
        type="button"
        role="tab"
        aria-selected={value === "bank"}
        className={value === "bank" ? "active" : ""}
        onClick={() => onChange("bank")}
      >
        Банковский перевод AED
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={value === "crypto"}
        className={value === "crypto" ? "active" : ""}
        onClick={() => onChange("crypto")}
      >
        Криптовалюта
      </button>
    </div>
  );
}

function BankDetails() {
  return (
    <div className="payment-card">
      <div className="details-grid">
        <Detail label="Банк" value="ADCB - Abu Dhabi Commercial Bank" />
        <Detail label="Имя счета" value="Marat Ohanyan" />
        <Detail label="Номер счета" value="11805839920001" />
        <Detail label="Валюта" value="AED" />
      </div>
      <div className="copy-panel">
        <div>
          <span>IBAN</span>
          <strong>{iban}</strong>
        </div>
        <CopyButton value={iban} label="Скопировать IBAN" />
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
            alt="QR-код кошелька TRC20"
            width={220}
            height={220}
            className="qr-image"
          />
        </div>
        <div className="crypto-content">
          <div className="crypto-total">
            <span>Сумма к оплате</span>
            <strong>USDT {formatUsdt(cryptoAmount)}</strong>
          </div>
          <div className="details-grid">
            <Detail label="Итого к оплате в AED" value={formatAed(totalAed)} />
            <Detail label="Сеть" value="TRC20" />
            <Detail label="Курс обмена" value="1 USDT = AED 3.66" />
          </div>
          <div className="copy-panel">
            <div>
              <span>Адрес кошелька</span>
              <strong>{walletAddress}</strong>
            </div>
            <CopyButton value={walletAddress} label="Скопировать адрес кошелька" />
          </div>
          <p className="warning">
            Пожалуйста, убедитесь, что перевод выполняется строго через сеть
            TRC20. Переводы через другие сети могут быть невосстановимыми.
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
      <span aria-live="polite">{copied ? "Скопировано" : ""}</span>
    </div>
  );
}
