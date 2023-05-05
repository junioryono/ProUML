package templates

import (
	"errors"

	"github.com/junioryono/ProUML/backend/types"
)

func GetTemplate(name string) (*[]any, *types.WrappedError) {
	switch name {
	case "abstract_factory":
		return getAbstractFactory(), nil
	case "adapter":
		return getAdapter(), nil
	case "bridge":
		return getBridge(), nil
	case "chain_of_responsibility":
		return getChainOfResponsibility(), nil
	case "command":
		return getCommand(), nil
	case "composite":
		return getComposite(), nil
	case "decorator":
		return getDecorator(), nil
	case "facade":
		return getFacade(), nil
	case "factory_method":
		return getFactoryMethod(), nil
	case "flyweight":
		return getFlyweight(), nil
	case "iterator":
		return getIterator(), nil
	case "mediator":
		return getMediator(), nil
	case "memento":
		return getMemento(), nil
	case "observer":
		return getObserver(), nil
	case "prototype":
		return getPrototype(), nil
	case "proxy":
		return getProxy(), nil
	case "singleton":
		return getSingleton(), nil
	case "state":
		return getState(), nil
	case "strategy":
		return getStrategy(), nil
	case "template_method":
		return getTemplateMethod(), nil
	case "visitor":
		return getVisitor(), nil
	default:
		return nil, types.Wrap(errors.New("template not found"), types.ErrInvalidRequest)
	}
}
