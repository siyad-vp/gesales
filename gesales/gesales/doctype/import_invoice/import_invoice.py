# Copyright (c) 2026, Tridz and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import flt


CHARGE_FIELDS = [
    "customs_vat",
    "custom_duty",
    "border_charge",
    "translation_charge",
    "clearing_charge",
    "documentation_charge",
    "collection_charge",
    "other_charge",
]


class ImportInvoice(Document):
    def validate(self):
        self.calculate_totals()

    def calculate_totals(self):
        total_qty = 0.0
        gross_total = 0.0

        for item in self.items:
            item.amount = flt(item.qty) * flt(item.rate)
            total_qty += flt(item.qty)
            gross_total += flt(item.amount)

        total_charges = sum(flt(self.get(f)) for f in CHARGE_FIELDS)

        vat_amount = (gross_total + total_charges) * flt(self.vat_rate) / 100

        self.total_qty = total_qty
        self.gross_total = gross_total
        self.total_charges = total_charges
        self.vat_amount = vat_amount
        self.net_total = gross_total + total_charges + vat_amount

