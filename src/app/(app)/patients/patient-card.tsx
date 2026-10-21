'use client'

import { format } from 'date-fns'
import { Pencil, Phone, PhoneCall, UserRound } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

import { EditPatientForm } from './edit-patient-form'

interface PatientCardProps {
  patient: {
    id: string
    name: string
    phone: string
    guardianName: string | null
    guardianPhone: string | null
    createdAt: string
  }
}

function WhatsappIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413" />
    </svg>
  )
}

interface InfoRowProps {
  icon: typeof Phone
  value: string
  mono?: boolean
}

function InfoRow({ icon: Icon, value, mono }: InfoRowProps) {
  const isEmpty = !value

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2.5">
          <Icon className="size-4 shrink-0 text-muted-foreground" />
          <span
            className={cn(
              'truncate',
              isEmpty ? 'text-muted-foreground' : mono && 'font-mono',
            )}
          >
            {value || '—'}
          </span>
        </div>
      </TableCell>
    </TableRow>
  )
}

export function PatientCard({ patient }: PatientCardProps) {
  const { name, phone, guardianName, guardianPhone, createdAt } = patient

  const whatsappNumber = phone.replace(/\D/g, '')

  // createdAt comes as UTC from the API; new Date renders it in the
  // browser's local timezone.
  const registeredAt = format(new Date(createdAt), "'Added' PP")

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="truncate">{name}</CardTitle>
        <CardDescription>{registeredAt}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <Table>
          <TableBody>
            <InfoRow icon={Phone} value={phone} mono />
            <InfoRow icon={UserRound} value={guardianName ?? ''} />
            <InfoRow icon={PhoneCall} value={guardianPhone ?? ''} mono />
          </TableBody>
        </Table>
      </CardContent>

      <CardFooter className="gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary" className="flex flex-1 items-center">
              <Pencil className="mr-2 size-4" />
              Edit
            </Button>
          </DialogTrigger>

          <EditPatientForm patient={patient} />
        </Dialog>

        <Button
          variant="outline"
          size="icon"
          className="shrink-0 text-emerald-600 hover:text-emerald-600 dark:text-emerald-500 dark:hover:text-emerald-500"
          asChild
        >
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
            aria-label={`Message ${name} on WhatsApp`}
          >
            <WhatsappIcon className="size-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
