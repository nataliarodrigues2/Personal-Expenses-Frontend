import Modal from '../../../components/ui/Modal/Modal'
import Button from '../../../components/ui/Button/Button'
import Input from '../../../components/ui/Input/Input'
import Select from '../../../components/ui/Select/Select'
import ErrorMessage from '../../../components/ErrorMessage/ErrorMessage'

const UploadIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 16V4M7 9l5-5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)
const RemoveIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

function extensaoDoArquivo(nomeOuUrl) {
  const semQuery = nomeOuUrl.split('?')[0]
  const partes = semQuery.split('.')
  return partes.length > 1 ? partes.pop().toUpperCase() : 'ARQ'
}

function formatarTamanho(bytes) {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  return `${Math.round(bytes / 1024)} KB`
}

export default function ModalDespesa({
  aberto,
  onClose,
  editando,
  form,
  errosForm,
  onCampoChange,
  categoriaOptions,
  statusOptions,
  salvando,
  onSalvar,
  erro,
  arquivoSelecionado,
  enviandoArquivo,
  erroArquivo,
  onSelecionarArquivo,
  onSoltarArquivo,
  onRemoverComprovante,
}) {
  return (
    <Modal
      open={aberto}
      onClose={onClose}
      title={editando ? 'Editar despesa' : 'Nova despesa'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onSalvar} loading={salvando}>
            {editando ? 'Salvar alterações' : 'Salvar despesa'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Input
          label="Descrição"
          value={form.descricao}
          onChange={(e) => onCampoChange('descricao', e.target.value)}
          placeholder="Ex: Mercado da semana"
          error={errosForm.descricao}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Valor"
            type="number"
            step="0.01"
            icon={<span className="font-mono text-[13px] text-text-3">R$</span>}
            value={form.valor}
            onChange={(e) => onCampoChange('valor', e.target.value)}
            placeholder="0,00"
            error={errosForm.valor}
          />
          <Input
            label="Data"
            type="date"
            value={form.data}
            onChange={(e) => onCampoChange('data', e.target.value)}
            error={errosForm.data}
          />
        </div>
        <Select
          label="Categoria"
          placeholder="Selecione uma categoria"
          options={categoriaOptions}
          value={form.categoryId}
          onChange={(e) => onCampoChange('categoryId', e.target.value)}
          error={errosForm.categoryId}
        />
        <Select label="Status" options={statusOptions} value={form.status} onChange={(e) => onCampoChange('status', e.target.value)} />

        <div>
          <label className="mb-[7px] block text-[12.5px] font-semibold text-text-2">
            Comprovante <span className="font-normal text-text-3">· opcional</span>
          </label>

          {form.comprovanteUrl ? (
            <div className="flex items-center gap-[11px] rounded-[11px] border border-border bg-surface-2 px-[13px] py-[11px]">
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-[9px] bg-danger-soft font-mono text-[10px] font-semibold text-danger">
                {extensaoDoArquivo(arquivoSelecionado?.nome || form.comprovanteUrl)}
              </span>
              <a
                href={form.comprovanteUrl}
                target="_blank"
                rel="noreferrer"
                className="min-w-0 flex-1 hover:underline"
                title="Ver comprovante"
              >
                <div className="truncate text-[12.5px] font-semibold text-text">{arquivoSelecionado?.nome || 'Comprovante anexado'}</div>
                <div className="text-[11px] text-text-3">
                  {arquivoSelecionado?.tamanho ? `${formatarTamanho(arquivoSelecionado.tamanho)} · enviado` : 'enviado anteriormente'}
                </div>
              </a>
              <button type="button" onClick={onRemoverComprovante} aria-label="Remover comprovante" className="text-text-3 hover:text-danger">
                {RemoveIcon}
              </button>
            </div>
          ) : (
            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={onSoltarArquivo}
              className={[
                'flex flex-col items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed border-border-strong bg-surface-2 p-[22px] text-center transition-colors',
                enviandoArquivo ? 'cursor-wait opacity-70' : 'cursor-pointer hover:border-primary hover:bg-primary-soft',
              ].join(' ')}
            >
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.pdf,image/png,image/jpeg,application/pdf"
                className="hidden"
                disabled={enviandoArquivo}
                onChange={onSelecionarArquivo}
              />
              <span className="flex h-[38px] w-[38px] items-center justify-center rounded-[11px] border border-border bg-surface text-primary">
                {enviandoArquivo ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                ) : (
                  UploadIcon
                )}
              </span>
              <span className="text-[12.5px] text-text-2">
                {enviandoArquivo ? (
                  'Enviando...'
                ) : (
                  <>
                    <strong className="text-primary">Clique para enviar</strong> ou arraste aqui
                  </>
                )}
              </span>
              <span className="text-[11px] text-text-3">PNG, JPG ou PDF · até 5 MB</span>
            </label>
          )}
          {erroArquivo && <p className="mt-1.5 text-xs text-danger">{erroArquivo}</p>}
        </div>

        <ErrorMessage mensagem={erro} />
      </div>
    </Modal>
  )
}
