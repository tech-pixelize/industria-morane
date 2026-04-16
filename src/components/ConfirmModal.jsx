import { useState, useCallback, createContext, useContext } from 'react'

const ConfirmCtx = createContext(null)

export function ConfirmProvider({ children }) {
  const [state, setState] = useState(null)

  const confirm = useCallback(({ title, msg, icon = '❓', okLabel = 'Confirmar', cancelLabel = 'Cancelar', danger = false }) => {
    return new Promise(resolve => {
      setState({ title, msg, icon, okLabel, cancelLabel, danger, resolve })
    })
  }, [])

  function close(result) {
    state?.resolve(result)
    setState(null)
  }

  return (
    <ConfirmCtx.Provider value={confirm}>
      {children}
      {state && (
        <div className="modal-overlay" onClick={() => close(false)}>
          <div className="modal modal-sm" onClick={e => e.stopPropagation()}>
            <div className="confirm-body">
              <div className="confirm-icon">{state.icon}</div>
              <div className="confirm-title">{state.title}</div>
              {state.msg && <div className="confirm-msg">{state.msg}</div>}
            </div>
            <div className="confirm-footer">
              {state.cancelLabel && (
                <button className="btn" onClick={() => close(false)}>{state.cancelLabel}</button>
              )}
              <button
                className={`btn ${state.danger ? 'btn-danger' : 'btn-primary'}`}
                onClick={() => close(true)}
              >
                {state.okLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmCtx.Provider>
  )
}

export function useConfirm() { return useContext(ConfirmCtx) }
