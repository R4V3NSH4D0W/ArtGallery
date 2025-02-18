'use server'

import prisma from '@/lib/prisma'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import { format } from 'date-fns'

export type StatementData = {
  data: string
  fileName: string
}

export async function generateMonthlyStatement(month: string): Promise<StatementData> {
  try {
    await prisma.$connect()
    
    const [year, monthNumber] = month.split('-')
    const startDate = new Date(Number(year), Number(monthNumber) - 1, 1)
    const endDate = new Date(Number(year), Number(monthNumber), 0)

    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        status: 'DELIVERED'
      },
      include: {
        user: { select: { name: true } },
        orderItems: {
          include: {
            product: { select: { name: true } },
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    })

    // Create PDF document
    const pdfDoc = await PDFDocument.create()
    pdfDoc.registerFontkit(fontkit)
    let page = pdfDoc.addPage([595, 842]) // A4 size (210x297mm)
    const { width, height } = page.getSize()
    
    // Load fonts and set styles
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const lineHeight = 14
    const margin = 40
    let yPosition = height - margin

    // Header Section
    page.drawText('COREWEAVE ART GALLERY', {
      x: margin,
      y: yPosition,
      size: 18,
      font: boldFont,
      color: rgb(0.2, 0.2, 0.2)
    })
    yPosition -= lineHeight * 2

    page.drawText(`Statement Period: ${format(startDate, 'dd MMM yyyy')} - ${format(endDate, 'dd MMM yyyy')}`, {
      x: margin,
      y: yPosition,
      size: 10,
      font: regularFont,
      color: rgb(0.4, 0.4, 0.4)
    })
    yPosition -= lineHeight * 2.5

    // Table Headers
    const columns = [
      { label: 'Date', x: margin },
      { label: 'Order ID', x: margin + 80 },
      { label: 'Items', x: margin + 180 },
      { label: 'Amount (NRs)', x: width - margin - 80 }
    ]

    // Draw table headers
    columns.forEach(({ label, x }) => {
      page.drawText(label, {
        x,
        y: yPosition,
        size: 10,
        font: boldFont,
        color: rgb(0.3, 0.3, 0.3)
      })
    })
    yPosition -= lineHeight * 1.5

    // Horizontal line
    page.drawLine({
      start: { x: margin, y: yPosition },
      end: { x: width - margin, y: yPosition },
      thickness: 0.5,
      color: rgb(0.8, 0.8, 0.8)
    })
    yPosition -= lineHeight * 1.5

    // Order Details
    orders.forEach((order) => {
      // Alternate row background
      page.drawRectangle({
        x: margin,
        y: yPosition + lineHeight,
        width: width - margin * 2,
        height: lineHeight * (order.orderItems.length + 1),
        color: rgb(0.97, 0.97, 0.97),
        opacity: 0.5
      })

      // Order metadata
      page.drawText(format(order.createdAt, 'dd/MM/yy'), {
        x: columns[0].x,
        y: yPosition,
        size: 9,
        font: regularFont
      })

      page.drawText(order.id.slice(0, 8), {
        x: columns[1].x,
        y: yPosition,
        size: 9,
        font: regularFont
      })

      // Items listing
      let itemY = yPosition
      order.orderItems.forEach((item) => {
        page.drawText(`• ${item.product.name} (Qty: ${item.quantity})`, {
          x: columns[2].x,
          y: itemY,
          size: 9,
          font: regularFont
        })
        itemY -= lineHeight
      })

      // Total amount
      page.drawText(order.totalAmount.toLocaleString('en'), {
        x: columns[3].x,
        y: yPosition,
        size: 9,
        font: regularFont,
        color: rgb(0.2, 0.2, 0.2)
      })

      // Update Y position based on number of items
      yPosition -= lineHeight * (order.orderItems.length + 1)
      
      // Page break if needed
      if (yPosition < margin + 100) {
        page = pdfDoc.addPage([595, 842])
        yPosition = height - margin
      }
    })

    // Total Summary
    const totalAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0)
    yPosition -= lineHeight * 2

    page.drawText('Grand Total:', {
      x: width - margin - 150,
      y: yPosition,
      size: 11,
      font: boldFont
    })

    page.drawText(`NRs ${totalAmount.toLocaleString('en')}`, {
      x: width - margin - 80,
      y: yPosition,
      size: 11,
      font: boldFont
    })

    // Footer
    yPosition = margin
    page.drawText('Core Weave Art Gallery • Kathmandu, Nepal • VAT No: 123456789', {
      x: margin,
      y: yPosition,
      size: 8,
      font: regularFont,
      color: rgb(0.5, 0.5, 0.5)
    })

    // Finalize PDF
    const pdfBytes = await pdfDoc.save()
    return {
      data: Buffer.from(pdfBytes).toString('base64'),
      fileName: `statement-${month}.pdf`
    }
  } catch (error) {
    console.error('Failed to generate statement:', error)
    throw new Error('Statement generation failed. Please try again.')
  } finally {
    await prisma.$disconnect()
  }
}