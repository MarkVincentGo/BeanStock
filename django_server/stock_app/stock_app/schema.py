import graphene
from graphene import relay
from graphene_django import DjangoObjectType
from stocks.models import Company

class CompanyType(DjangoObjectType):
    class Meta:
        model = Company
        interfaces = (relay.Node,)
        fields = "__all__"


class CompanyConection(relay.Connection):
    class Meta:
        node = CompanyType


class Query(graphene.ObjectType):
    companies = relay.ConnectionField(CompanyConection)
    all_companies = graphene.List(CompanyType)
    company_by_tick = graphene.Field(CompanyType, ticks=graphene.String(required=True))
    company_by_name = graphene.Field(CompanyType, name=graphene.String(required=True))

    # For Pagination
    def resolve_companies(self, info, **kwargs):
        # print(kwargs)
        print(Company.objects.all()[0].pe_ratio)
        return Company.objects.all()

    def resolve_all_companies(self, info):
        return Company.objects.all()

    def resolve_company_by_tick(self, info, ticks):
        try:
            return None
        except Company.DoesNotExist:
            return None

    def resolve_company_by_name(self, info, name):
        try:
            return Company.objects.get(name=name);
        except Company.DoesNotExist:
            return None

schema = graphene.Schema(query=Query)