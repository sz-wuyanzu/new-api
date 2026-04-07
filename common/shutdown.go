package common

import (
	"context"
)

// ShutdownCtx is cancelled when the application is shutting down.
// All background goroutines should select on this context to exit gracefully.
var ShutdownCtx context.Context
var shutdownCancel context.CancelFunc

func init() {
	ShutdownCtx, shutdownCancel = context.WithCancel(context.Background())
}

// TriggerShutdown cancels the global shutdown context, signalling all
// background goroutines to stop. Safe to call multiple times.
func TriggerShutdown() {
	shutdownCancel()
}

// IsShuttingDown returns true if shutdown has been initiated.
func IsShuttingDown() bool {
	select {
	case <-ShutdownCtx.Done():
		return true
	default:
		return false
	}
}
