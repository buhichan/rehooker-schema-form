import { FormFieldSchema } from './types';

export const isFullWidth = (field:FormFieldSchema)=>{
    return field.fullWidth || typeof field.type === 'string' && ['textarea','group','array','file','table-array','virtual-group','full-width'].includes(field.type)
}