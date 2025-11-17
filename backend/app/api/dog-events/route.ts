import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, badRequest, serverError } from '@/lib/http'
import { dogEventCreateSchema } from '@/lib/validators'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = Math.max(1, Number(searchParams.get('page') ?? '1'))
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get('pageSize') ?? '20')))
  const dogId = searchParams.get('dogId') ? Number(searchParams.get('dogId')) : undefined
  const eventTypeId = searchParams.get('eventTypeId') ? Number(searchParams.get('eventTypeId')) : undefined
  const since = searchParams.get('since') ? new Date(String(searchParams.get('since'))) : undefined
  const until = searchParams.get('until') ? new Date(String(searchParams.get('until'))) : undefined

  const where: any = {}
  if (dogId) where.dogId = dogId
  if (eventTypeId) where.eventTypeId = eventTypeId
  if (since || until) where.eventAt = { gte: since, lte: until }

  const [items, total] = await Promise.all([
    prisma.dogEvent.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { eventAt: 'desc' },
      include: {
        eventType: true,
        walkEvent: true,
        playEvent: true,
        trainingEvent: true,
        symptomEvent: true,
        vaccineEvent: true,
        medicationEvent: true,
        vetVisitEvent: true,
        weightEvent: true,
        expenseEvent: true,
      },
    }),
    prisma.dogEvent.count({ where }),
  ])

  return ok({ items, page, pageSize, total })
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json()
    const body = dogEventCreateSchema.parse(json)

    const data: any = {
      dogId: body.dogId,
      eventTypeId: body.eventTypeId,
      eventAt: body.eventAt,
      note: body.note,
      imageUrl: body.imageUrl,
    }

    if (body.detail) {
      switch (body.detail.type) {
        case 'WALK':
          data.walkEvent = {
            create: {
              distanceKm: body.detail.distanceKm,
              durationMin: body.detail.durationMin,
            },
          }
          break

        case 'PLAY':
          // PlayEvent: durationMin?
          data.playEvent = {
            create: {
              durationMin: body.detail.durationMin,
            },
          }
          break

        case 'TRAINING':
          data.trainingEvent = {
            create: {
              durationMin: body.detail.durationMin,
            },
          }
          break

        case 'SYMPTOM':
          data.symptomEvent = {
            create: {
              symptom: body.detail.symptom,
              severity: body.detail.severity,
              sinceWhen: body.detail.sinceWhen,
            },
          }
          break

        case 'VACCINE':
          // VaccineEvent: ไม่มี field เพิ่ม → create เปล่าได้
          data.vaccineEvent = {
            create: {
              // vaccineName / dose / vetClinic / vetName / nextDueDate ไม่มีใน schema
            },
          }
          break

        case 'MEDICATION':
          // MedicationEvent: dosageAmount?, dosageUnit?
          data.medicationEvent = {
            create: {
              dosageAmount: body.detail.dosageAmount,
              dosageUnit: body.detail.dosageUnit,
              // drugName / frequency / startDate / endDate ไม่มีใน schema
            },
          }
          break

        case 'VET_VISIT':
          // VetVisitEvent: reason?, clinicName?, vetName?, cost?, nextAppointment?
          data.vetVisitEvent = {
            create: {
              reason: body.detail.reason,
              clinicName: body.detail.clinicName,
              vetName: body.detail.vetName,
              cost: body.detail.cost,
              nextAppointment: body.detail.nextAppointment,
            },
          }
          break

        case 'WEIGHT':
          // WeightEvent: weightKg (required)
          data.weightEvent = {
            create: {
              weightKg: body.detail.weightKg,
              // bodyScore ไม่มีใน schema
            },
          }
          break

        case 'EXPENSE':
          // ExpenseEvent: amount, currency?
          data.expenseEvent = {
            create: {
              amount: body.detail.amount,
              currency: body.detail.currency,
              // category / paymentNote ไม่มีใน schema
            },
          }
          break
      }
    }

    const created = await prisma.dogEvent.create({
      data,
      include: {
        eventType: true,
      },
    })
    return ok(created, { status: 201 })
  } catch (err: any) {
    if (err?.name === 'ZodError') return badRequest('Invalid body', err)
    if (err?.code === 'P2003') return badRequest('Invalid dogId or eventTypeId')
    return serverError(err)
  }
}